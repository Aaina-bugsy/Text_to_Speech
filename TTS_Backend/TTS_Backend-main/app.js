const express = require("express")
var path = require("path")
var cookieParser = require("cookie-parser")
const cors = require("cors")
const dotenv = require("dotenv").config()
const bodyParser = require("body-parser")
var indexRouter = require("./routes")

const app = express()

app.use(cookieParser())

app.use(express.json({ limit: "300mb" }))
app.use(express.urlencoded({ limit: "300mb", extended: false }))

app.use("/static", express.static(path.join(__dirname, "public")))
app.use("/", express.static(path.join(__dirname, "public")))

app.use(bodyParser.json({ limit: "300mb" }))
app.use(bodyParser.urlencoded({ limit: "300mb", extended: true }))

// Array Of Cors (Domains)
app.use(
    cors({
        origin: "*",
        methods: ["POST", "PUT", "GET", "OPTIONS", "HEAD", "DELETE"],
        credentials: true
    })
)

// Router
app.use("/", indexRouter)

// View Engine Setup
app.set("views", path.join(__dirname, "views"))
app.set("view engine", "ejs")
app.set("view options", {
    layout: false
})


// Server Listening To Port Number
app.listen(9000, function () {
    console.log(`Server started at ${9000}`);
});