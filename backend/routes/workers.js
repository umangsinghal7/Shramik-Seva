const express = require('express');
const router = express.Router();
const pool = require('../database.js');

// Get all workers
router.get("/", async (req, res, next) => {
    const { skill, location } = req.query;
    let sql = "select * from workers";
    let params = [];

    if (skill && location) {
        sql += " WHERE skill LIKE ? AND location LIKE ?";
        params.push(`%${skill}%`, `%${location}%`);
    } else if (skill) {
        sql += " WHERE skill LIKE ?";
        params.push(`%${skill}%`);
    } else if (location) {
        sql += " WHERE location LIKE ?";
        params.push(`%${location}%`);
    }

    let connection;
    try {
        connection = await pool.getConnection();
        const [rows] = await connection.query(sql, params);
        res.json({
            "message": "success",
            "data": rows
        });
    } catch (err) {
        res.status(400).json({ "error": err.message });
    } finally {
        if (connection) connection.release();
    }
});

module.exports = router;
