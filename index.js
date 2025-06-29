
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'salary_app'
});

app.get('/api/salaries', (req, res) => {
  db.query('SELECT * FROM salaries', (err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
});

app.post('/api/salaries', (req, res) => {
  const s = req.body;
  const sql = `INSERT INTO salaries
    (id, name, department, position, contract, month, netSalary, complement, ticket, mission, fuel, comm, bonus, irpp, cnss, totalNet, totalBrut)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  const values = [
    s.id, s.name, s.department, s.position, s.contract, s.month,
    s.netSalary, s.complement, s.ticket, s.mission, s.fuel,
    s.comm, s.bonus, s.irpp, s.cnss, s.totalNet, s.totalBrut
  ];
  db.query(sql, values, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ status: 'success' });
  });
});

app.listen(5000, () => {
  console.log('Server is running on port 5000');
});
