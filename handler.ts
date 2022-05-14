require("dotenv").config()

import sendMessage from "./lib/push"

module.exports.run = async (event: any, _context: any, _callback: any) => {
  console.log("env ", process.env)
  console.log("Received event:", JSON.stringify(event, null, 4))

  const message = event.Records[0].Sns.Message
  const subject = event.Records[0].Sns.subject
  console.log("Message received from SNS:", message)
  sendMessage(message, subject)
}
