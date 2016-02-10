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
