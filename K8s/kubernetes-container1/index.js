const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const fs = require("fs");

const app = express();

const PORT = 6000;
const STORAGE_PATH = "/sumit_PV_dir";

app.use(bodyParser.json());

app.post("/store-file", (req, res) => {
  const { file, data } = req.body;

  console.log("File store request");

  if (file == null)
    return res.status(500).json({
      file: null,
      error: "Invalid JSON input.",
    });

  try {
    fs.writeFileSync(`${STORAGE_PATH}/${file}`, data);
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      file: file,
      error: "Error while storing the file to the storage.",
    });
  }

  res.send({ file: file, message: "Success." });
});

app.post("/calculate", (req, res) => {
  const { file, product } = req.body;

  if (file == null)
    return res.send({ file: null, error: "Invalid JSON input." });

  if (!fs.existsSync(`${STORAGE_PATH}/${file}`)) {
    return res.send({ file: file, error: "File not found." });
  }

  axios
    .post("http://container2-service/process", req.body)
    .then((response) => {
      return res.send(response.data);
    })
    .catch((error) => {
      console.log(error);
      res.send(error);
    });
});

app.get("/status", (req, res) => {
  res.send({
    success: true,
    message: "Container 1: Working"
  });
});

app.listen(PORT, () => {
  console.log("Container 1 is running on PORT: " + PORT);
});
