"use strict"
require("dotenv").config()

const sendMessage = require("./lib/push")

module.exports.run = async (event, context, callback) => {
  sendMessage()
}
