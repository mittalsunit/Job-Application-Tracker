const AWS = require("aws-sdk");
require("dotenv").config();

/// Configure AWS S3
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
  });
  
  // Upload a file to S3
  const uploadToS3 = (fileStream, fileName) => {
    const params = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `documents/${fileName}`, // S3 key for the uploaded file
      Body: fileStream,
    };
  
    return s3.upload(params).promise(); // Returns a promise
  };
  
  module.exports = uploadToS3;
