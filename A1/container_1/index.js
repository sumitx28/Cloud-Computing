const express = require("express");
const bodyParser = require("body-parser");
const axios = require('axios');
const fs = require('fs')

const app = express();

const PORT = 6000;

app.use(bodyParser.json());

app.post("/calculate", (req, res) => {
    const { file, product } = req.body;

    if (file == null) return res.send({ "file": null, "error": "Invalid JSON input." });

    if (!fs.existsSync(`./host_volume/${file}`)) {
        return res.send({ "file": file, "error": "File not found." });
    }

    axios.post('http://sumit_cloud_cont_2:3000/process', req.body).then(response => {
        return res.send(response.data);
    })
        .catch(error => {
            console.log(error);
            res.send(error);
        });

})

app.listen(PORT, () => {
    console.log("Container 1 is running on PORT: " + PORT);
})