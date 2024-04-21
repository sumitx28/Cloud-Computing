const express = require("express");
const bodyParser = require("body-parser");
const csv = require('csv-parser')
const fs = require('fs')

const app = express();

app.use(bodyParser.json());

function parseCsv(filePath) {
    const results = [];

    return new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
            .pipe(csv())
            .on('data', (row) => {
                if (!row.product || !row.amount) {
                    reject({
                        file: filePath,
                        error: 'Input file not in CSV format.'
                    });
                } else {
                    results.push(row);
                }
            })
            .on('end', () => {
                resolve(results);
            });
    });
}

function calculateSumForProduct(data, productName) {
    const filteredData = data.filter(item => item.product.toUpperCase() === productName.toUpperCase());
    const sum = filteredData.reduce((acc, item) => acc + parseFloat(item.amount), 0);
    return sum;
}

app.post("/process", (req, res) => {
    console.log("Processing");

    const { file, product } = req.body;

    parseCsv(`./host_volume/${file}`)
        .then((data) => {
            const sum = calculateSumForProduct(data, product);

            if(sum != 0) return res.send({ file, sum });
            else{ return res.send({ "file": file, "error": "Input file not in CSV format." })};
        })
        .catch((error) => {
            return res.send({ "file": file, "error": "Input file not in CSV format." });
        });

})

app.listen(3000, () => {
    console.log("App listening on PORT: 3000");
})