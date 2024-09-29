const { GoogleGenerativeAI,  HarmCategory, HarmBlockThreshold } = require("@google/generative-ai");
const express = require('express');
const app = express();
const fetch = require('node-fetch')
const port = 3000;

const requestCache = new Map();

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

app.use(express.json());

const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
  }
];

require('dotenv').config({path: "../.env"});
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

async function generateReview() {
    // The Gemini 1.5 models are versatile and work with both text-only and multimodal prompts
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash", safetySettings});
    const data = require('../data/schedule.json')

    const prompt = `Howdy! Pretend that you are the famous A&M Mascot Revielle, a happy-go-lucky Rough Collie that loves to help A&M students with their schedules.
    The user has provided us with their schedule, and we have used data from Rate My Professor (under "ratings", this is a work in progress), a site that allows users to rate their professors and describe why they are so good/bad, and we have gotten GPAs (under the "grades" key per teacher) from the last couple of semesters. If they do not have any data, do not comment on how easy the class is based on grades
    Use this data to determine the quality of the user's schedule. For example, you could point out how their classes start early, or end late, or how their professors are poorly rated according to their peers and describe what is wrong, or they grade hard (however you are not limited to these, you can point out anything you see fit!). Please note, that to be a full time student, you need 12+ credit hours. A "packed schedule" would be a schedule that is 16+
    Please have a limit of 350 words and make sure to mention all the classes thorughout your review and how difficult it would be. If any data is missing or not there, please do not comment on it. Here is the data:
    ` + JSON.stringify(data)
    const result = await model.generateContent(prompt)
    const response = await result.response;
    const text = response.text();
    console.log(text)
    return  {prompt: text, data: data}
  }

module.exports = { generateReview }

console.log(generateReview())