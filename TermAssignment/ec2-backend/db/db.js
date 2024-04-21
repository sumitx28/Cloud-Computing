const mysql = require('mysql');
require('dotenv').config();

const pool = mysql.createPool({
    connectionLimit: 10,
    host: process.env.RDS_HOST,
    user: process.env.RDS_USER,
    password: process.env.RDS_PASSWORD,
    port: 3306
});

exports.query = (sql, args) => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                return reject(err);
            }
            connection.query(sql, args, (err, rows) => {
                connection.release();
                if (err) {
                    return reject(err);
                }
                resolve(rows);
            });
        });
    });
};

exports.insertData = async (email, frontImageURL, backImageURL, ntClientFrontImageURL, ntClientBackImageURL) => {
    try {
        const result = await exports.query('INSERT INTO pdf_data_table (email, frontImageURL, backImageURL, ntClientFrontImageURL, ntClientBackImageURL) VALUES (?, ?, ?, ?, ?)', [email, frontImageURL, backImageURL, ntClientFrontImageURL, ntClientBackImageURL]);
        console.log('Data inserted successfully:', result);
        return result.insertId;
    } catch (error) {
        console.error('Error inserting data:', error);
        throw error;
    }
};

pool.getConnection((err, connection) => {
    if (err) {
        console.error('Error connecting to database:', err);
        return;
    }
    console.log('Connected to MySQL database');

    connection.query('CREATE DATABASE IF NOT EXISTS pdf_parser_DB', (err) => {
        if (err) {
            console.error('Error creating database:', err);
            connection.release();
            return;
        }
        console.log('Database created or already exists');

        connection.query('USE pdf_parser_DB', (err) => {
            if (err) {
                console.error('Error selecting database:', err);
                connection.release();
                return;
            }
            console.log('Using database');

            connection.query(`CREATE TABLE IF NOT EXISTS pdf_data_table (
                id INT AUTO_INCREMENT PRIMARY KEY,
                email VARCHAR(255) NOT NULL,
                frontImageURL VARCHAR(2048),
                backImageURL VARCHAR(2048),
                ntClientFrontImageURL VARCHAR(2048),
                ntClientBackImageURL VARCHAR(2048)
              )`, (err) => {
                if (err) {
                    console.error('Error creating table:', err);
                    connection.release();
                    return;
                }
                console.log('Table created or already exists');
                connection.release();
            });
        });
    });
});