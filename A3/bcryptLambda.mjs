import bcrypt from 'bcryptjs';
import axios from 'axios';

export const handler = async (event) => {
    const value = event.value;
    const courseUrl = event.course_uri;
    const lambdaArn = "arn:aws:lambda:us-east-1:992382484559:function:bcrypt-lambda";

    try {
        const saltRounds = 10;
        const salt = await bcrypt.genSalt(saltRounds);
        const hashedPassword = await bcrypt.hash(value, salt);

        const axiosResponse = await axios.post(courseUrl, {
            banner: "B00955671",
            result: hashedPassword,
            arn: lambdaArn,
            action: "bcrypt",
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
