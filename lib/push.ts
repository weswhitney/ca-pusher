import AWS from "aws-sdk"

const region = process.env.AWS_REGION

const title = "Test message sent from Amazon Pinpoint."

// const message = "This is a sample message sent from Amazon Pinpoint by using the " + "AWS SDK for JavaScript in Node.js"

const applicationId = process.env.APP_ID

const recipient = {
  token: process.env.TOKEN,
  service: "APNS",
}

const action = "URL"

const url = "https://www.example.com"

const priority = "high"

const ttl = 30

const silent = false

function CreateMessageRequest(msg: any) {
  const token: any = recipient["token"]
  const service = recipient["service"]
  let messageRequest
  if (service == "GCM") {
    messageRequest = {
      Addresses: {
        [token]: {
          ChannelType: "GCM",
        },
      },
      MessageConfiguration: {
        GCMMessage: {
          Action: action,
          Body: msg,
          Priority: priority,
          SilentPush: silent,
          Title: title,
          TimeToLive: ttl,
          Url: url,
        },
      },
    }
  } else if (service == "APNS") {
    messageRequest = {
      Addresses: {
        [token]: {
          ChannelType: "APNS",
        },
      },
      MessageConfiguration: {
        APNSMessage: {
          Action: action,
          Body: msg,
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

function ShowOutput(data: any) {
  let status
  if (
    // @ts-ignore
    data["MessageResponse"]["Result"][recipient["token"]]["DeliveryStatus"] ==
    "SUCCESSFUL"
  ) {
    status = "Message sent! Response information: "
  } else {
    status = "The message wasn't sent. Response information: "
  }
  console.log(status)
  console.dir(data, { depth: null })
}

export default function SendMessage(msg: any) {
  const token = recipient["token"]
  const service = recipient["service"]
  const messageRequest = CreateMessageRequest(msg)

  // Specify that you're using a shared credentials file, and specify the
  // IAM profile to use.

  // comment this out for AWS Lambda
  // const credentials = new AWS.SharedIniFileCredentials({ profile: "default" })
  // AWS.config.credentials = credentials

  // comment this in for AWS Lambda
  AWS.config.credentials

  AWS.config.update({ region: region })

  const pinpoint = new AWS.Pinpoint()
  const params = {
    ApplicationId: applicationId,
    MessageRequest: messageRequest,
  }

  // @ts-ignore
  pinpoint.sendMessages(params, function (err, data) {
    if (err) console.log("error in send message", err)
    else ShowOutput(data)
  })
}
