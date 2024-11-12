const express = require("express")
const router = express.Router()

const path = require('path');
const LibFunction = require("../../../helpers/libFunction")
const googleApi = require("./../../../helpers/googleApi");
const { url } = require("inspector");
const { clouddebugger } = require("googleapis/build/src/apis/clouddebugger");

const convertTextToSpeechModule = async (request) => {
    try {
        // console.log(req);
        const req = request.body;
        let inputType = req.input_type ? req.input_type : null
        let text = req?.text ? req?.text : null
        let url = req.url ? req.url : null
        let file = request.file ? request.file : null
        let languageCode = req.language_code ? req.language_code : 'en-GB'
        let voiceType = req.voice_type ? req.voice_type.toUpperCase() : 'MALE'
        let speakingRate = req.speaking_rate ? req.speaking_rate : 1
        let pitch = req.pitch ? req.pitch : 1
        let voiceName = req.voice_name ? req.voice_name : 'en-GB-Wavenet-B'

        console.log(req?.text)

        const currentTimestamp = await LibFunction.formateDateLib()

        console.log(inputType)
        if(!inputType) {
            return {
                status: false,
                error: {
                    cose: 1001,
                    message: "ERROR! Please provide input text to convert to speech."
                }
            }
        }

        if(inputType == 'pdf') {
            if(!file) {
                return {
                    status: false,
                    error: "ERROR! Please provide the file"
                }
            }
            const extractText = await googleApi.extractTextFromPDF(file.path)
            if(!extractText.status) {
                return extractText
            }

            text = extractText.data
        } else if(inputType == 'url') {
            if(!url) {
                return {
                    status: false,
                    error: "ERROR! Please provide the file"
                }
            }

            const extractText = await googleApi.extractTextFromURL(url)
            console.log(extractText)
            if(!extractText.status) {
                return extractText
            }

            text = extractText.data.replace(/\n/g, ' ');
        }

        let outputFileName  = `output-${currentTimestamp.replaceAll(" ", "_").replaceAll(":", "_")}.mp3`;

        if(!text) {
            console.log("in")
            return {
                status: false,
                error: {
                    cose: 1001,
                    message: "ERROR! Please provide input text to convert to speech."
                }
            }
        }

        console.log(text)
        // console.log(text, languageCode, voiceType, speakingRate, pitch, voiceName, outputFileName)
        const convertTextToSpeechFile = await googleApi.convertTextToSpeech(text, languageCode, voiceType, speakingRate, pitch, voiceName, outputFileName)
        if(!convertTextToSpeechFile.status) {
            return convertTextToSpeechFile
        }

        return {
            status: true,
            data: [
                {
                    output_file_name: outputFileName
                }
            ],
            url: `/output/${outputFileName}`
        }
        

    } catch (err) {
        console.log(err)
        return {
            status: false,
            error: err.message
        }
    }
}

const listLanguagesAndVoicesModule = async (req) => {
    try {

        const getTextToSpeechLanguagesAndVoicesList = await googleApi.getTextToSpeechLanguagesAndVoices()
        return getTextToSpeechLanguagesAndVoicesList

    } catch (err) {
        console.log(err)
        return {
            status: false,
            error: err.message
        }
    }
}

module.exports = {
    convertTextToSpeechModule: convertTextToSpeechModule,
    listLanguagesAndVoicesModule: listLanguagesAndVoicesModule
}