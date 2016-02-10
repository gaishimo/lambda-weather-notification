
### About this

A Lambda function to send a message about weather forecast to your Slack room.

This codes are written by ES6 (babel & gulp).

Node.js version is v0.10.xx.

### Deploy

#### Install gulp

```
npm install -g gulp
```


#### Edit lambda-config.js

Example

```js
module.exports = {
	//accessKeyId: <access key id>,  // optional
	//secretAccessKey: <secret access key>,  // optional
	//profile: <shared credentials profile name>, // optional for loading AWS credientail from custom profile
	region: 'ap-northeast-1',
	handler: 'index.handler',
	role: "arn:aws:iam::109572732475:role/tool-lambda",
	functionName:"tool-weather",
	timeout: 10,
	memorySize: 128
	//eventSource: {
	//	EventSourceArn: "",
	//	BatchSize: 200,
	//	StartingPosition: "TRIM_HORIZON"
	//}
}

```

#### Deploy

```
npm install
gulp deploy
```

### Call the function

#### Example (AWS CLI)

```
aws lambda invoke --function-name "tool-weather" \
  --payload '{"keyword": "today", "slackWebhookUrl": "<Your Slack Webhook URL>" }' \
  /dev/null
```
