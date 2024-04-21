const express = require("express");
const bodyParser = require("body-parser");
const csv = require("csv-parser");
const fs = require("fs");

const app = express();
const STORAGE_PATH = "/sumit_PV_dir";

app.use(bodyParser.json());

// comment undone

function parseCsv(filePath) {
  const results = [];

  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (row) => {
        results.push(row);
      })
      .on("error", (error) => {
        reject(error);
      })
      .on("end", () => {
        resolve(results);
      });
  });
}

function calculateSumForProduct(data, productName) {
  const filteredData = data.filter(
    (item) => item.product.toUpperCase() === productName.toUpperCase()
  );

  let sum = 0;

  filteredData.forEach((item) => {
    let x = parseInt(item[" amount "].trim());
    sum += x;
  });

  return sum;
}

app.post("/process", (req, res) => {
  console.log("Processing");

  const { file, product } = req.body;

  parseCsv(`${STORAGE_PATH}/${file}`)
    .then((data) => {
      const sum = calculateSumForProduct(data, product);

      console.log(sum);

      if (sum != 0) return res.send({ file, sum });
      else
        return res.send({ file: file, error: "Input file not in CSV format." });
    })
    .catch((error) => {
      return res.send({ file: file, error: "Input file not in CSV format." });
    });
});

app.listen(3000, () => {
  console.log("App listening on PORT: 3000");
});
