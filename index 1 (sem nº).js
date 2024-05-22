const express = require('express');
const mysql = require('mysql2');

const app = express();
const port = '3000';

const connection = mysql.createConnection({
  host: '10.97.8.48',
  user: 'root',
  password: '6718',
  database: 'pf_db',
  port: '3305'
});

app.get('/', (req, res) => {
  connection.query('SELECT * FROM produtos', function (error, results, fields) {
    if (error) throw error;
    res.send(`${results[0].name} - ${results[1].name}`);
    // Do not close connection here
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});

// Optionally, you can handle closing connection when the app is shutting down
process.on('SIGINT', () => {
  connection.end();
  process.exit();
});