const express = require("express")
const router = express.Router()
const dotenv = require("dotenv").config()
const libFunction = require("./libFunction")
const { google } = require("googleapis")

// Import the Google Cloud client library
const textToSpeech = require('@google-cloud/text-to-speech');
const fs = require('fs');
const axios = require("axios");
const puppeteer = require('puppeteer');
const util = require('util');
const path = require('path');
const pdfParse = require("pdf-parse");
const cheerio = require("cheerio");

// Create a Text-to-Speech client
const client = new textToSpeech.TextToSpeechClient({
    keyFilename: './probable-anchor-437015-s7-f41db44f2449.json'
});

async function getTextToSpeechLanguagesAndVoices() {
    try {
        const [result] = await client.listVoices({});
        const voices = result.voices;

        const languageMap = {};
        voices.forEach(voice => {
            voice.languageCodes.forEach(languageCode => {
                if (!languageMap[languageCode]) {
                    languageMap[languageCode] = [];
                }
                languageMap[languageCode].push(voice.name);
            });
        });

        console.log('Available Languages and Voices:');
        Object.keys(languageMap).forEach(language => {
            console.log(`Language: ${language}`);
            console.log(`Voices: ${languageMap[language].join(', ')}`);
        });

        // Format the response
        const formattedResponse = Object.keys(languageMap).map((language) => ({
            Language: language,
            Voices: languageMap[language].join(", "),
        }));

        return {
            status: true,
            data: formattedResponse
        }

    } catch (error) {
        console.error('Error fetching voices:', error);
    }
}

// Function to convert text to speech
async function convertTextToSpeech(text, languageCode, voiceType, speakingRate, pitch, voiceName, outputFileName) {
    console.log("inside convert")
    const request = {
        input: { text: text },
        voice: {
            languageCode: languageCode,
            name: voiceName,
            ssmlGender: voiceType.toUpperCase()
        },
        audioConfig: {
            audioEncoding: 'MP3',
            speakingRate: speakingRate,
            pitch: pitch
        }
    };

    console.log(request)

    // Perform the Text-to-Speech request
    const [response] = await client.synthesizeSpeech(request);
    if(!response || !response?.audioContent) {
        return {
            status: false,
            error: err.message
        }
    }

    console.log("1")
    console.log(response)

    const outputFilePath = path.join(__dirname, "../public/output", outputFileName);

    // Create the output directory if it doesn't exist
    const outputDir = path.dirname(outputFilePath);
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }


    console.log("2")
    console.log(response.audioContent)
    await fs.writeFile(outputFilePath, response.audioContent, (err) => {
        if (err) {
            console.log(err);
            return {
                status: false,
                error: err.message
            }
        }
        console.log(`Audio content written to file: ${outputFilePath}`);
    });

    return {
        status: true
    }

}

// Function to handle PDF file and extract text
async function extractTextFromPDF(pdfFilePath) {
    try {
        // console.log("extractTextFromPDF")
        // console.log(pdfFilePath)
        // console.log(path.resolve(__dirname,pdfFilePath))
        const dataBuffer = fs.readFileSync(pdfFilePath); //fs.readFileSync(pdfFilePath);
        // console.log(dataBuffer)

        const pdfData = await pdfParse(dataBuffer);
        // console.log(pdfData)

        return {
            status: true,
            data: pdfData.text
        }
    } catch (error) {
        return {
            status: false,
            error: "Failed to extract text from PDF: " + error.message
        }
    }
}

// Function to handle URL and extract text from webpage
async function extractTextFromURL(url) {
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'networkidle2' });
        
        // Extracting text from the body of the webpage
        const bodyText = await page.evaluate(() => {
            return document.body.innerText;
        })

        await browser.close();
        return {
            status: true,
            data: bodyText.trim()
        };
    } catch (error) {
        return {
            status: false,
            error: "Failed to extract text from URL: " + error.message
        };
    }
}

module.exports = {
    getTextToSpeechLanguagesAndVoices: getTextToSpeechLanguagesAndVoices,
    convertTextToSpeech: convertTextToSpeech,
    extractTextFromPDF: 
    extractTextFromPDF,
    extractTextFromURL: extractTextFromURL
};