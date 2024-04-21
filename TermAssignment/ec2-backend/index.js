const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const fs = require("fs");
const path = require("path");
const { extractImage } = require("./util/utils");
const { insertData } = require("./db/db");
const { sendEmailNotification } = require("./util/sns");
require('dotenv').config();

const app = express();

app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.get("/hello", (req, res) => {
    res.send("Hello");
});

app.post("/parse-images", async (req, res) => {
    try {
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: process.env.LAMBDA_URL,
            headers: {
                'Content-Type': 'application/json'
            },
            data: req.body
        };

        const response = await axios.request(config);

        if (!response.data || !response.data.ntClientFrontImage) {
            console.error('Response data or image data is missing');
            return res.status(500).send('Response data or image data is missing');
        }

        const { frontImage, backImage, ntClientFrontImage, ntClientBackImage } = response.data;

        const frontImageURL = await extractImage(frontImage.buffer, `frontImageFull${Date.now().toString()}`);
        const backImageURL = await extractImage(backImage.buffer, `backImageFull${Date.now().toString()}`);
        const ntClientFrontImageURL = await extractImage(ntClientFrontImage.buffer, `frontImage${Date.now().toString()}`);
        const ntClientBackImageURL = await extractImage(ntClientBackImage.buffer, `frontImage${Date.now().toString()}`);

        const insertId = await insertData("savaliyasumit717@gmail.com", frontImageURL, backImageURL, ntClientFrontImageURL, ntClientBackImageURL);

        const message = `Images parsed successfully. Links:\nFront Image: ${frontImageURL}\nBack Image: ${backImageURL}\nNT Client Front Image: ${ntClientFrontImageURL}\nNT Client Back Image: ${ntClientBackImageURL}`;

        await sendEmailNotification("savaliyasumit717@gmail.com", message);

        return res.send({
            insertId,
            frontImageURL,
            backImageURL,
            ntClientFrontImageURL,
            ntClientBackImageURL
        });
    } catch (error) {
        if (error.code === 'ECONNABORTED') {
            return res.status(500).send('API request timed out');
        } else {
            console.log(error)
            return res.status(500).send('Internal server error');
        }
    }
})

function saveImageToFile(imageData, imageName) {
    const imagePath = path.join(__dirname, 'parsed-images', `${imageName}.png`);
    fs.writeFileSync(imagePath, imageData);
    return imagePath;
}

app.listen(process.env.PORT, () => {
    console.log("App listening on PORT: " + process.env.PORT);
})