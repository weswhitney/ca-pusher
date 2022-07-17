import AWS from "aws-sdk"
const region = process.env.AWS_REGION

const applicationId = process.env.APP_ID

const recipient = {
  token: process.env.TOKEN_MYPHONE,
  service: "APNS",
}

const action = "URL"

const url = "https://www.example.com"

const priority = "high"

const ttl = 30

const silent = false

function CreateMessageRequest(snsEvent: any, endpoint: any) {
  const token: any = endpoint.Address
  const service = endpoint.ChannelType
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
          Body: snsEvent.Records[0].Sns.Message,
          Priority: priority,
          SilentPush: silent,
          Title: snsEvent.Records[0].Sns.Subject,
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
          Body: snsEvent.Records[0].Sns.Message,
          Priority: priority,
          SilentPush: silent,
          Title: snsEvent.Records[0].Sns.Subject,
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

export async function sendMessage(evt: any) {
  const token = recipient["token"]
  const service = recipient["service"]
  // Specify that you're using a shared credentials file, and specify the
  // IAM profile to use.

  // comment this out for AWS Lambda
  // const credentials = new AWS.SharedIniFileCredentials({ profile: "default" })
  // AWS.config.credentials = credentials

  // comment this in for AWS Lambda
  AWS.config.credentials

  AWS.config.update({ region: region })

  const pinpoint = new AWS.Pinpoint()
  const userParams = {
    ApplicationId: applicationId,
    UserId: "123456789",
  }
  const endpoints = await pinpoint
    // @ts-ignore
    .getUserEndpoints(userParams)
    .promise()
    .catch(console.log)
  //@ts-ignore
  console.log(endpoints.EndpointsResponse.Item[0])
  //@ts-ignore
  const endpoint = endpoints.EndpointsResponse.Item[0]
  const messageRequest = CreateMessageRequest(evt, endpoint)

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
