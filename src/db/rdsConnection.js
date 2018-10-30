const mysql = require('mysql');

const config = {
  host: 'rdslibrarydb.c8uy4mhjr2tk.eu-central-1.rds.amazonaws.com',
  user: 'rdsLilbrary',
  password: 'Meitar9515!',
  database: 'libraryDB',
  port: 1433
};

module.exports = mysql.createConnection(config);
