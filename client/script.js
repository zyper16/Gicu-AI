import bot from "./assets/bot.svg";
import user from "./assets/user.svg";

const form = document.querySelector("form");
const chatContainer = document.querySelector("#chat_container");

let loadInterval;

const loader = function (element) {
  element.textContent = "";
  loadInterval = setInterval(() => {
    element.textContent =
      element.textContent === "...." ? "" : (element.textContent += ".");
  }, 300);
};

let interval;

const typeText = function (element, text) {
  element.textContent = "";
  let index = 0;

  const interval = setInterval(() => {
    if (index < text.length) element.textContent += text.charAt(index);
    else clearInterval(interval);
    index++;
  }, 30);
};

const generateUniqueID = function () {
  const timestamp = Date.now();
  const randomNumber = Math.random() * 100000000000000000;
  const hexadecimalString = randomNumber.toString(16);
  return `id-${timestamp}-${hexadecimalString}`;
};

const chatStripe = function (isAi, value, uniqueId) {
  return `
    <div class="wrapper ${isAi && "ai"}">
        <div class="chat">
            <div class="profile">
                <img src='${isAi ? bot : user}' alt="${isAi ? "bot" : "user"}" >
            </div>
            <div class="message" id=${uniqueId}>${value}</div>
        </div>
    </div>
    `;
};

const handleSubmit = async e => {
  e.preventDefault();
  const data = new FormData(form);
  chatContainer.innerHTML += chatStripe(false, data.get("prompt"));
  form.reset();
  const stripeID = generateUniqueID();
  chatContainer.innerHTML += chatStripe(true, data.get(" "), stripeID);
  chatContainer.scrollTop = chatContainer.scrollHeight;
  const responseDiv = document.getElementById(stripeID);
  loader(responseDiv);

  // Fetch the data from the server
  const response = await fetch("http://localhost:5000", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt: data.get("prompt"),
    }),
  });
  clearInterval(loadInterval);
  responseDiv.innerHTML = "";
  if (response.ok) {
    const data = await response.json();
    const parsedData = data.bot.trim();
    typeText(responseDiv, parsedData);
  } else {
    const err = await response.text();
    console.log(err);
    responseDiv.innerHTML = "Something went wrong!";
  }
};

form.addEventListener("submit", handleSubmit);
form.addEventListener("keydown", e => {
  if (e.key === "Enter") handleSubmit(e);
});
