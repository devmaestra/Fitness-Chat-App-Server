// FOR AWS s3 Buckets

const aws = require('aws-sdk')
const crypto = require("crypto")

const region = "us-east-1"
const bucketName = "aws-swoulmates-bucket"
const accessKeyId = process.env.AWS_ACCESS_KEY_ID
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY

const s3 = new aws.S3 ({
    region,
    accessKeyId,
    secretAccessKey,
    signatureVersion: "v4"
})

async function uploadURL() {
    console.log('TESTING')
const rawBytes = await crypto.randomBytes(16)
const imgName = rawBytes.toString("hex")
console.log(imgName)

const params = {
    Bucket: bucketName,
    Key: imgName,
    Expires: 15,

}
let awsURL = await s3.getSignedUrlPromise('putObject', params);
console.log(awsURL)
return awsURL
}

module.exports = uploadURL;