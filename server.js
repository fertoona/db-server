const express = require('express');

const mysql = require('mysql');
const connection = mysql.createConnection({
  host: '127.0.0.1',
  port: 3306,
  user: 'root',
  database: 'mobil_operator',
});

connection.connect();

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.send('hello world');
});

app
  .route('/customers')
  .get((req, res) => {
    const sql = 'select * from customers';

    connection.query(sql, (err, rows) => {
      if (err) {
        res.json({ message: err.message }).status(422);
      } else {
        res.json({ rows });
      }
    });
  })
  .post((req, res) => {
    const { body } = req;

    const set = [];

    Object.entries(body).forEach(([name, value]) => {
      if (typeof value === 'string') {
        set.push(`${name}='${value}'`);
      } else {
        set.push(`${name}=${value}`);
      }
    });

    const values = set.join(', ');

    console.log(values);

    const sql = `insert into customers set ${values};`;

    connection.query(sql, (err) => {
      if (err) {
        res.json({ message: err.message }).status(422);
      } else {
        res.json({ message: 'customer created' }).status(201);
      }
    });
  })
  .put((req, res) => {})
  .delete((req, res) => {});

app.listen(8080, () => {
  console.log('app started on 8080 port');
});
