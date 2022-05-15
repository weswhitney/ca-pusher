require("dotenv").config()

import { sendMessage } from "./lib/push"

module.exports.run = async (event: any, context: any, callback: any) => {
  console.log("Received event:", JSON.stringify(event, null, 4))
  var result = sendMessage(event)
  callback(null, result)
}
