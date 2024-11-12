const request = require("request")

const formateDateLib = async (date) => {
    var d = date ? new Date(date) : new Date(),
        month = 1 + d.getMonth() < 10 ? "0" + (d.getMonth() + 1) : d.getMonth() + 1,
        day = d.getDate() < 10 ? "0" + d.getDate() : d.getDate(),
        year = d.getFullYear(),
        hour = d.getHours() < 10 ? "0" + d.getHours() : d.getHours(),
        minute = d.getMinutes() < 10 ? "0" + d.getMinutes() : d.getMinutes(),
        second = d.getSeconds() < 10 ? "0" + d.getSeconds() : d.getSeconds()

    var str = [year, month, day].join("-")
    var formatedDate = `${str} ${hour}:${minute}:${second}`
    return formatedDate
}

const getCurrentTimeStamp = async (date) => {
    date = date ? new Date(date) : new Date()
    // let currentTimeStamp = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
    let currentTimeStamp = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
    return currentTimeStamp
}

module.exports = { 
    formateDateLib: formateDateLib, 
    getCurrentTimeStamp: getCurrentTimeStamp 
};