
const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const app = express();

app.use(cors());
app.use(express.json());

const db = new sqlite3.Database('./db.sqlite');

// Create table if not exists
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS salaries (
    id TEXT,
    name TEXT,
    department TEXT,
    position TEXT,
    contract TEXT,
    month TEXT,
    netSalary REAL,
    complement REAL,
    ticket REAL,
    mission REAL,
    fuel REAL,
    comm REAL,
    bonus REAL,
    irpp REAL,
    cnss REAL,
    totalNet REAL,
    totalBrut REAL
  )`);
});

app.get('/api/salaries', (req, res) => {
  db.all('SELECT * FROM salaries', [], (err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
});

app.post('/api/salaries', (req, res) => {
  const s = req.body;
  const sql = \`INSERT INTO salaries (
    id, name, department, position, contract, month,
    netSalary, complement, ticket, mission, fuel,
    comm, bonus, irpp, cnss, totalNet, totalBrut
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)\`;
  const values = [
    s.id, s.name, s.department, s.position, s.contract, s.month,
    s.netSalary, s.complement, s.ticket, s.mission, s.fuel,
    s.comm, s.bonus, s.irpp, s.cnss, s.totalNet, s.totalBrut
  ];
  db.run(sql, values, function(err) {
    if (err) return res.status(500).json(err);
    res.json({ status: 'success', id: this.lastID });
  });
});

app.listen(5000, () => {
  console.log('✅ SQLite server running on port 5000');
});
