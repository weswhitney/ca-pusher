require("dotenv").config()

import sendMessage from "./lib/push"

module.exports.run = async (event: any, _context: any, _callback: any) => {
  console.log("Received event:", JSON.stringify(event, null, 4))

  const message = event.Records[0].Sns.Message
  console.log("Message received from SNS:", message)
  sendMessage(message)
}
