
const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// SQLite DB setup
const db = new sqlite3.Database("./salaries.db", (err) => {
    if (err) console.error("DB connection error", err.message);
    else console.log("Connected to SQLite database");
});

// Create salaries table if not exists
db.run(`CREATE TABLE IF NOT EXISTS salaries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nom TEXT,
    prenom TEXT,
    salaire_base REAL,
    prime REAL,
    mois TEXT,
    departement TEXT,
    contrat TEXT
)`);

// Login endpoint (hardcoded credentials)
app.post("/api/login", (req, res) => {
    const { username, password } = req.body;
    if (username === "admin" && password === "1234") {
        res.json({ success: true });
    } else {
        res.status(401).json({ success: false, message: "Invalid credentials" });
    }
});

// Add salary
app.post("/api/salaries", (req, res) => {
    const { nom, prenom, salaire_base, prime, mois, departement, contrat } = req.body;
    const sql = `INSERT INTO salaries (nom, prenom, salaire_base, prime, mois, departement, contrat)
                 VALUES (?, ?, ?, ?, ?, ?, ?)`;
    db.run(sql, [nom, prenom, salaire_base, prime, mois, departement, contrat], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ id: this.lastID });
    });
});

// Get all or filtered salaries
app.get("/api/salaries", (req, res) => {
    const { month } = req.query;
    let sql = "SELECT * FROM salaries";
    const params = [];

    if (month) {
        sql += " WHERE mois = ?";
        params.push(month);
    }

    db.all(sql, params, (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
