const AWS = require('aws-sdk');

AWS.config.update({
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
    sessionToken: process.env.SESSION_TOKEN,
    region: process.env.REGION
});

const sns = new AWS.SNS();

async function sendEmailNotification(userEmail, message) {
    const snsParams = {
        Message: message,
        Subject: 'Image Parsing Notification',
        TopicArn: process.env.SNS_TOPIC_ARN
    };
    try {
        const data = await sns.publish({
            ...snsParams,
            MessageAttributes: {
                'email': {
                    DataType: 'String',
                    StringValue: userEmail
                }
            }
        }).promise();
        console.log('SNS message published successfully:', data);
    } catch (error) {
        console.error('Error publishing SNS message:', error);
        throw error;
    }
}

module.exports = { sendEmailNotification };
