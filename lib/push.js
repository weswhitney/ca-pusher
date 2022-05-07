"use strict"

const AWS = require("aws-sdk")

// The AWS Region that you want to use to send the message. For a list of
// AWS Regions where the Amazon Pinpoint API is available, see
// https://docs.aws.amazon.com/pinpoint/latest/apireference/
const region = process.env.AWS_REGION

// The title that appears at the top of the push notification.
var title = "Test message sent from Amazon Pinpoint."

// The content of the push notification.
var message =
  "This is a sample message sent from Amazon Pinpoint by using the " +
  "AWS SDK for JavaScript in Node.js"

// The Amazon Pinpoint project ID that you want to use when you send this
// message. Make sure that the push channel is enabled for the project that
// you choose.
var applicationId = process.env.APP_ID

// An object that contains the unique token of the device that you want to send
// the message to, and the push service that you want to use to send the message.
var recipient = {
  token: process.env.TOKEN,
  service: "APNS",
}

// The action that should occur when the recipient taps the message. Possible
// values are OPEN_APP (opens the app or brings it to the foreground),
// DEEP_LINK (opens the app to a specific page or interface), or URL (opens a
// specific URL in the device's web browser.)
var action = "URL"

// This value is only required if you use the URL action. This variable contains
// the URL that opens in the recipient's web browser.
var url = "https://www.example.com"

// The priority of the push notification. If the value is 'normal', then the
// delivery of the message is optimized for battery usage on the recipient's
// device, and could be delayed. If the value is 'high', then the notification is
// sent immediately, and might wake a sleeping device.
var priority = "high"

// The amount of time, in seconds, that the push notification service provider
// (such as FCM or APNS) should attempt to deliver the message before dropping
// it. Not all providers allow you specify a TTL value.
var ttl = 30

// Boolean that specifies whether the notification is sent as a silent
// notification (a notification that doesn't display on the recipient's device).
var silent = false

function CreateMessageRequest() {
  var token = recipient["token"]
  var service = recipient["service"]
  if (service == "GCM") {
    var messageRequest = {
      Addresses: {
        [token]: {
          ChannelType: "GCM",
        },
      },
      MessageConfiguration: {
        GCMMessage: {
          Action: action,
          Body: message,
          Priority: priority,
          SilentPush: silent,
          Title: title,
          TimeToLive: ttl,
          Url: url,
        },
      },
    }
  } else if (service == "APNS") {
    var messageRequest = {
      Addresses: {
        [token]: {
          ChannelType: "APNS",
        },
      },
      MessageConfiguration: {
        APNSMessage: {
          Action: action,
          Body: message,
          Priority: priority,
          SilentPush: silent,
          Title: title,
          TimeToLive: ttl,
          Url: url,
        },
      },
    }
  }
  return messageRequest
}

function ShowOutput(data) {
  if (
    data["MessageResponse"]["Result"][recipient["token"]]["DeliveryStatus"] ==
    "SUCCESSFUL"
  ) {
    var status = "Message sent! Response information: "
  } else {
    var status = "The message wasn't sent. Response information: "
  }
  console.log(status)
  console.dir(data, { depth: null })
}

module.exports = function SendMessage() {
  var token = recipient["token"]
  var service = recipient["service"]
  var messageRequest = CreateMessageRequest()

  // Specify that you're using a shared credentials file, and specify the
  // IAM profile to use.

  // comment this out for AWS Lambda
  var credentials = new AWS.SharedIniFileCredentials({ profile: "default" })
  AWS.config.credentials = credentials

  // comment this in for AWS Lambda
  // AWS.config.credentials

  // Specify the AWS Region to use.
  AWS.config.update({ region: region })

  //Create a new Pinpoint object.
  var pinpoint = new AWS.Pinpoint()
  var params = {
    ApplicationId: applicationId,
    MessageRequest: messageRequest,
  }

  // Try to send the message.
  pinpoint.sendMessages(params, function (err, data) {
    if (err) console.log("error in send message", err)
    else ShowOutput(data)
  })
}

// SendMessage()
