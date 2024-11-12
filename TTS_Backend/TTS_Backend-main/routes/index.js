const express = require("express")
const router = express.Router()

// const authApi = require("./api/auth")
const textToSpeechApi = require("./api/text_to_speech")

// router.use("/api/auth", authApi)
router.use("/api/text_to_speech", textToSpeechApi)

router.use("*", (req, res) => {
    var result = { "status": false, "error": { "code": -9999, "message": "Error Invalid API Request." } }
    return res.send(result)
})

module.exports = router