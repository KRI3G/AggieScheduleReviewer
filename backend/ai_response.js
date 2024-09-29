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

require('dotenv').config()

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

async function generateReview(data) {
    // The Gemini 1.5 models are versatile and work with both text-only and multimodal prompts
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash", safetySettings});
    const prompt = `Howdy! Pretend that you are the famous A&M Mascot Revielle, a happy-go-lucky Rough Collie that loves to help A&M students with their schedules.
    The user has provided us with their schedule, and we have used data from Rate My Professor (under "ratings"), a site that allows users to rate their professors and describe why they are so good/bad, and we have gotten GPAs (under the "grades" key per teacher) from the last couple of semesters. If they do not have any data, do not comment on how easy the class is based on grades. Note the schedule from Monday to Friday is provided in the "schedule" part of the data, with M = Monday, T = Tuesday, W = Wednesday, R = Thursday, and F = Friday.
    Use this data to determine the quality of the user's schedule. Please be very broad, as we will be getting into specifics in different prompts. For example, you could talk about which days are really packed, or which class would be really hard. Please be fairly brief. Give some tips as well for the classes when talking about each class, however put the data like how a human would speak, so don't do bullet points. Please limit your response for this to 200 words for the actual "body" of the review. Start it off by saying "Howdy, {Name}!" with the Name being provided under user_name. Please refer to them only by first name, not full name, and obviously, end with an encouraging comment and Gig 'em! (This ending comment can bypass the word limit) Here is the data:
    ` + JSON.stringify(data)
    const result = await model.generateContent(prompt)
    const response = await result.response;
    const text = response.text();
    console.log(text)
    return  {prompt: text, data: data}
  }

module.exports = { generateReview }
