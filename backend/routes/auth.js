const express = require('express');
const router = express.Router();
const pool = require('../database.js');

// User Signup
router.post("/signup", async (req, res, next) => {
    var errors = []
    if (!req.body.password) {
        errors.push("No password specified");
    }
    if (!req.body.email) {
        errors.push("No email specified");
    }
    if (errors.length) {
        res.status(400).json({ "error": errors.join(",") });
        return;
    }
    var data = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        role: 'user'
    }
    let connection;
    try {
        connection = await pool.getConnection();
        const sql = 'INSERT INTO users (name, email, password) VALUES (?,?,?)'
        const params = [data.name, data.email, data.password]
        const [result] = await connection.query(sql, params);
        res.json({
            "message": "success",
            "data": data,
            "id": result.insertId
        })
    } catch (err) {
        res.status(400).json({ "error": err.message })
    } finally {
        if (connection) connection.release();
    }
});

// User Login
router.post("/login", async (req, res, next) => {
    var errors = []
    if (!req.body.password) {
        errors.push("No password specified");
    }
    if (!req.body.email) {
        errors.push("No email specified");
    }
    if (errors.length) {
        res.status(400).json({ "error": errors.join(",") });
        return;
    }
    let connection;
    try {
        connection = await pool.getConnection();
        const sql = "select *, 'user' as role from users where email = ? and password = ?"
        const params = [req.body.email, req.body.password]
        const [rows] = await connection.query(sql, params);
        if (rows.length === 0) {
            res.status(404).json({ "message": "User not found" });
        } else {
            res.json({
                "message": "success",
                "data": rows[0]
            })
        }
    } catch (err) {
        res.status(400).json({ "error": err.message });
    } finally {
        if (connection) connection.release();
    }
});

// Worker Signup
router.post("/worker/signup", async (req, res, next) => {
    var errors = []
    if (!req.body.password) {
        errors.push("No password specified");
    }
    if (!req.body.email) {
        errors.push("No email specified");
    }
    if (!req.body.name) {
        errors.push("No name specified");
    }
    if (!req.body.skill) {
        errors.push("No skill specified");
    }
    if (!req.body.location) {
        errors.push("No location specified");
    }
    if (!req.body.experience) {
        errors.push("No experience specified");
    }
    if (!req.body.phone) {
        errors.push("No phone specified");
    }
    if (errors.length) {
        res.status(400).json({ "error": errors.join(",") });
        return;
    }
    var data = {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        skill: req.body.skill,
        location: req.body.location,
        experience: req.body.experience,
        phone: req.body.phone,
        role: 'worker'
    }
    let connection;
    try {
        connection = await pool.getConnection();
        const sql = 'INSERT INTO workers (name, email, password, skill, location, experience, phone) VALUES (?,?,?,?,?,?,?)'
        const params = [data.name, data.email, data.password, data.skill, data.location, data.experience, data.phone]
        const [result] = await connection.query(sql, params);
        res.json({
            "message": "success",
            "data": data,
            "id": result.insertId
        })
    } catch (err) {
        res.status(400).json({ "error": err.message })
    } finally {
        if (connection) connection.release();
    }
});

// Worker Login
router.post("/worker/login", async (req, res, next) => {
    var errors = []
    if (!req.body.password) {
        errors.push("No password specified");
    }
    if (!req.body.email) {
        errors.push("No email specified");
    }
    if (errors.length) {
        res.status(400).json({ "error": errors.join(",") });
        return;
    }
    let connection;
    try {
        connection = await pool.getConnection();
        const sql = "select *, 'worker' as role from workers where email = ? and password = ?"
        const params = [req.body.email, req.body.password]
        const [rows] = await connection.query(sql, params);
        if (rows.length === 0) {
            res.status(404).json({ "message": "Worker not found" });
        } else {
            res.json({
                "message": "success",
                "data": rows[0]
            })
        }
    } catch (err) {
        res.status(400).json({ "error": err.message });
    } finally {
        if (connection) connection.release();
    }
});

module.exports = router;