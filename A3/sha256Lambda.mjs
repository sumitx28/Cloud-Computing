import sha256 from 'sha256';
import axios from 'axios';

export const handler = async (event) => {
    const value = event.value;
    const courseUrl = event.course_uri;
    const lambdaArn = "arn:aws:lambda:us-east-1:992382484559:function:sha256-lambda";

    try {
        const hashedPassword = sha256(value);

        const axiosResponse = await axios.post(courseUrl, {
            banner: "B00955671",
            result: hashedPassword,
            arn: lambdaArn,
            action: "sha256",
            value: value
        });

        const response = {
            statusCode: axiosResponse.status,
            body: JSON.stringify(axiosResponse.data),
        };
        return response;
    } catch (error) {
        const response = {
            statusCode: 500,
            body: JSON.stringify({ message: "Error hashing password or making Axios request" }),
        };
        return response;
    }
};
