const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const mysql = require("mysql");

const connection = mysql.createConnection({
  host: "database-1.c1yw48momjk6.us-east-1.rds.amazonaws.com",
  user: "admin",
  password: "Sumit2801",
  port: "3306",
  database: "productsDB",
});

const createDBSQL = `CREATE DATABASE IF NOT EXISTS productsDB`;

connection.connect(function (err) {
  if (err) {
    console.error("Database connection failed: " + err.stack);
    return;
  }
  console.log("Connected to database.");
});

connection.query(createDBSQL, (error, results, fields) => {
  if (error) {
    console.error("Error creating database: ", error);
    res.status(500).send("Internal Server Error");
    return;
  }
});

const app = express();

const PORT = 3000;

app.use(bodyParser.json());
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms")
);

app.get("/", (req, res) => {
  res.send("Working");
});

app.get("/setup-db", (req, res) => {
  connection.query(createDBSQL, (error, results, fields) => {
    if (error) {
      console.error("Error creating database: ", error);
      res.status(500).send("Internal Server Error");
      return;
    }

    const useDBSQL = `USE productsDB`;
    connection.query(useDBSQL, (error, results, fields) => {
      if (error) {
        console.error("Error using database: ", error);
        res.status(500).send("Internal Server Error");
        return;
      }

      const createTableSQL = `
          CREATE TABLE IF NOT EXISTS products (
            name VARCHAR(100),
            price VARCHAR(100),
            availability BOOLEAN
          )`;

      connection.query(createTableSQL, (error, results, fields) => {
        if (error) {
          console.error("Error creating table: ", error);
          res.status(500).send("Internal Server Error");
          return;
        }
        res.status(200).send("Database and table created successfully.");
      });
    });
  });
});

app.get("/list-products", (req, res) => {
  connection.query(
    "SELECT name, price, CASE WHEN availability = 1 THEN true ELSE false END AS availability FROM products",
    (error, results, fields) => {
      if (error) {
        console.error("Error retrieving products: ", error);
        res.status(500).send("Internal Server Error");
        return;
      }
      const modifiedResults = results.map((product) => {
        return {
          name: product.name,
          price: product.price,
          availability: product.availability === 0 ? false : true,
        };
      });
      res.status(200).json(modifiedResults);
    }
  );
});

app.post("/store-products", (req, res) => {
  const products = req.body.products;
  if (!Array.isArray(products)) {
    res.status(400).send("Invalid input: products should be an array.");
    return;
  }

  const values = products.map(({ name, price, availability }) => [
    name,
    price,
    availability,
  ]);

  connection.query(
    "INSERT INTO products (name, price, availability) VALUES ?",
    [values],
    (error, results, fields) => {
      if (error) {
        console.error("Error inserting products: ", error);
        res.status(500).send("Internal Server Error");
        return;
      }
      res.status(200).send({
        message: "Success.",
      });
    }
  );
});

app.listen(PORT, () => {
  console.log(`App is listening on PORT: ${PORT}`);
});
