import bot from "./assets/bot.svg";
import user from "./assets/user.svg";

const form = document.querySelector("form");
const textarea = document.querySelector("textarea");
const chatContainer = document.querySelector("#chat_container");

let loadInterval;

const loader = function (element) {
  element.textContent = "";
  loadInterval = setInterval(() => {
    element.textContent =
      element.textContent === "...." ? "" : (element.textContent += ".");
  }, 300);
};

const textareaResize = function () {
  this.style.height = "auto";
  this.style.height = this.scrollHeight * 1.01 + "px";
};

let interval;

const typeText = function (element, text) {
  element.textContent = "";
  let index = 0;

  const interval = setInterval(() => {
    if (index < text.length) {
      element.textContent += text.charAt(index);
      element.scrollIntoView(false);
    } else clearInterval(interval);
    index++;
  }, 10);
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
  textarea.style.height = "auto";
  const data = new FormData(form);
  chatContainer.innerHTML += chatStripe(false, data.get("prompt"));
  form.reset();
  const stripeID = generateUniqueID();
  chatContainer.innerHTML += chatStripe(true, data.get(" "), stripeID);
  chatContainer.scrollTop = chatContainer.scrollHeight;
  const responseDiv = document.getElementById(stripeID);
  loader(responseDiv);

  // Fetch the data from the server
  // const response = await fetch("https://gicu-ai.onrender.com", {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  //   body: JSON.stringify({
  //     prompt: data.get("prompt"),
  //   }),
  // });
  clearInterval(loadInterval);
  // responseDiv.innerHTML = "";
  // if (response.ok) {
  //   const data = await response.json();
  //   const parsedData = data.bot.trim();
  //   // typeText(responseDiv, parsedData);
  // } else {
  //   const err = await response.text();
  //   console.log(err);
  //   responseDiv.innerHTML = "Something went wrong!";
  // }

  typeText(
    responseDiv,
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis ut suscipit est. Proin sed quam vel augue bibendum tristique vitae vel libero. Donec porttitor justo eget molestie gravida. Sed eget ex bibendum, varius urna in, rhoncus enim. Quisque eget lobortis leo. Nulla elementum neque vel pulvinar sollicitudin. Morbi id aliquet libero. Duis at turpis nulla. Nulla varius vulputate urna, sit amet commodo lectus placerat vitae. Morbi aliquam, ex eget vulputate dapibus, est ipsum vestibulum ipsum, et egestas ipsum nisi vitae dolor. Etiam enim quam, euismod ut lorem non, maximus auctor justo.Etiam ipsum tellus, rhoncus sed efficitur a, semper id libero. Etiam nec quam ut sapien consectetur porta. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque a dapibus leo. Nunc ligula arcu, elementum sagittis elit non, rhoncus consectetur nisl. Sed pulvinar finibus eros, bibendum auctor nisl. Sed lobortis orci dignissim imperdiet pharetra. Aliquam varius a turpis eu porttitor. Praesent euismod leo non nisl ullamcorper iaculis. Proin varius, urna eget luctus tempus, libero neque porttitor ipsum, a rutrum felis lorem et mauris. Praesent id risus orci. In dictum maximus neque vitae lobortis. Donec laoreet sodales mi, eu iaculis leo consectetur eget. Phasellus quis ex sed massa efficitur molestie et id quam. Pellentesque a magna sit amet lectus ultrices placerat."
  );
  textarea.focus();
};

// Form submit listeners
form.addEventListener("submit", handleSubmit);
form.addEventListener("keyup", e => {
  if (e.key === "Enter" && !e.shiftKey) handleSubmit(e);
});

// Textarea resize listener
textarea.addEventListener("input", textareaResize);
