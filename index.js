const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// SQLite Database setup
const db = new sqlite3.Database('./salaries.db', (err) => {
    if (err) return console.error(err.message);
    console.log('Connected to the SQLite database.');
});

db.run(`CREATE TABLE IF NOT EXISTS salaries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nom TEXT,
    prenom TEXT,
    date TEXT,
    net REAL,
    departement TEXT,
    contrat TEXT
)`);

// Routes
app.post('/api/salaries', (req, res) => {
    const { nom, prenom, date, net, departement, contrat } = req.body;
    const sql = `INSERT INTO salaries (nom, prenom, date, net, departement, contrat) VALUES (?, ?, ?, ?, ?, ?)`;
    db.run(sql, [nom, prenom, date, net, departement, contrat], function(err) {
        if (err) return res.status(400).json({ error: err.message });
        res.json({ id: this.lastID });
    });
});

app.get('/api/salaries', (req, res) => {
    const { month } = req.query;
    let sql = `SELECT * FROM salaries`;
    const params = [];

    if (month) {
        sql += ` WHERE strftime('%Y-%m', date) = ?`;
        params.push(month);
    }

    db.all(sql, params, (err, rows) => {
        if (err) return res.status(400).json({ error: err.message });
        res.json(rows);
    });
});

app.delete('/api/salaries/:id', (req, res) => {
    const { id } = req.params;
    const sql = `DELETE FROM salaries WHERE id = ?`;
    db.run(sql, [id], function(err) {
        if (err) return res.status(400).json({ error: err.message });
        res.json({ deleted: this.changes });
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});