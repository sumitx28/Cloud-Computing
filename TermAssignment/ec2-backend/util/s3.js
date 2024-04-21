const AWS = require('aws-sdk');
require('dotenv').config();
const { promisify } = require('util');

AWS.config.update({
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
    sessionToken: process.env.SESSION_TOKEN,
    region: process.env.REGION
});

const uploadImage = async (imgName, imageDataBuffer) => {
    const bucketName = process.env.S3_BUCKET_NAME;
    const s3Bucket = new AWS.S3({ params: { Bucket: bucketName } });

    const putObjectAsync = promisify(s3Bucket.putObject).bind(s3Bucket);

    const data = {
        Key: imgName,
        Body: imageDataBuffer,
        ContentEncoding: 'base64',
        ContentType: 'image/jpeg'
    };

    try {
        await putObjectAsync(data);
    } catch (err) {
        console.error(err);
        throw new Error('Error uploading data');
    }

    const url = await getPublicUrl(imgName);
    return url;
};

const getPublicUrl = async (imgName) => {
    const bucketName = process.env.S3_BUCKET_NAME;
    const s3Bucket = new AWS.S3({ params: { Bucket: bucketName } });

    const getSignedUrlAsync = promisify(s3Bucket.getSignedUrl).bind(s3Bucket);

    const urlParams = { Bucket: bucketName, Key: imgName, Expires: 31536000 };

    try {
        const url = await getSignedUrlAsync('getObject', urlParams);
        return url;
    } catch (err) {
        console.error('Error getting URL: ', err);
        throw new Error('Error getting URL');
    }
}

module.exports.uploadImage = uploadImage;
