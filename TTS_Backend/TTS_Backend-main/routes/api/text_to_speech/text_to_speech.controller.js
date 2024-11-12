const express = require("express")
const router = express.Router()

const path = require('path');
const fs = require('fs');
const textToSpeechModule = require("./text_to_speech.module")

const convertTextToSpeechController = async (req, res) => {
    
    
    let result = await textToSpeechModule.convertTextToSpeechModule(req)
    // if(result.status) {
    //     // Send the audio file as a response
    //     const outputFilePath = await path.join(__dirname, "../../../public/output", result.data[0].output_file_name);

    //     setTimeout(async() => {
    //          // Read the MP3 file as a buffer
    //         const fileBuffer = await fs.promises.readFile(outputFilePath);

    //         // Set headers and send the file content directly
    //         res.setHeader('Content-Type', 'audio/mpeg');
    //         res.setHeader('Content-Disposition', `attachment; filename=${result.data[0].output_file_name}`);
    //         res.send(fileBuffer);
    //     }, 2000);
        
    // } else {
    //     return result
    // }

    return res.send(result)

}

const listLanguagesAndVoicesController = async (req, res) => {
    let result = await textToSpeechModule.listLanguagesAndVoicesModule(req)
    return res.send(result)
}

module.exports = {
    convertTextToSpeechController: convertTextToSpeechController,
    listLanguagesAndVoicesController: listLanguagesAndVoicesController
}