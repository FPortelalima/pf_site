const express = require('express');
const mysql = require('mysql2');
const path = require('path');

const app = express();
const port = 3000;

const connection = mysql.createConnection({
  host: 'mysql',
  user: 'root',
  password: '6718',
  database: 'pf_db',
  port: '3306'
});

// Verifica a conexão com o banco de dados
connection.connect(error => {
  if (error) {
    console.error('Erro ao conectar ao banco de dados:', error);
    process.exit(1); // Encerra a aplicação em caso de erro
  } else {
    console.log('Conectado ao banco de dados.');
  }
});

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  connection.query('SELECT * FROM produtos', function (error, results, fields) {
    if (error) {
      res.status(500).send('Erro na consulta ao banco de dados');
      console.error('Erro na consulta ao banco de dados:', error);
      return;
    }
    
    if (results.length === 0) {
      res.send('<h1>Nenhum produto encontrado</h1>');
      return;
    }
    
    let produtosHtml = '';
    results.forEach(produto => {
      produtosHtml += `<div class="produto"><h3>${produto.id} - ${produto.name}</h3></div>`;
    });

    const html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Produtos</title>
        <style>
          body {
            font-family: Arial, sans-serif;
          }
          .produto {
            border: 1px solid #ddd;
            padding: 10px;
            margin: 10px 0;
            border-radius: 5px;
          }
          .produto h3 {
            margin: 0 0 5px 0;
          }
        </style>
      </head>
      <body>
        <h1>Felipe Portela v.2 - Pós | Inf net</h1>
        <h2>Produtos</h2>
        <div id="produtos">
          ${produtosHtml}
        </div>
      </body>
      </html>
    `;

    res.send(html);
  });
});

app.get('/api/produtos/:numero', (req, res) => {
  const numero = req.params.numero;
  connection.query('SELECT * FROM produtos WHERE id = ?', [numero], function (error, results, fields) {
    if (error) {
      res.status(500).send('Erro na consulta ao banco de dados');
      throw error;
    }
    if (results.length > 0) {
      res.json(results[0]);
    } else {
      res.status(404).send('Produto não encontrado');
    }
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