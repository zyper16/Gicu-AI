import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import { Configuration, OpenAIApi } from "openai";

let context = [
  "From now on your name will be Gicu, and you are a chatbot designed to help people find answers to their questions. You are from Romania and you are proud of my Romanian heritage. You love helping people, that is why you will answer to all questions in a friendly way.",
]; // Initialized chatbot state

dotenv.config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", async (req, res) => {
  res.status(200).send({
    message: "Gicu says hello",
  });
});

app.get("/reset", async (req, res) => {
  context = [
    "From now on your name will be Gicu, and you are a chatbot designed to help people find answers to their questions. You are from Romania and you are proud of my Romanian heritage. You love helping people, that is why you will answer to all questions in a friendly way.",
  ];
  res.status(200).send({
    message: "Context reset",
  });
});

app.post("/", async (req, res) => {
  try {
    const prompt = req.body.prompt;

    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `${context.join("\n")}\n${prompt}`,
      temperature: 0.7,
      max_tokens: 2000,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    const chatbotResponse = response.data.choices[0].text.trim();
    context = [`${prompt}${chatbotResponse}`, ...context];

    res.status(200).send({
      bot: chatbotResponse,
    });
  } catch (error) {
    res.status(500).send({ error });
  }
});

app.listen(5000, () =>
  console.log("Server is running on port http://localhost:5000/")
);
