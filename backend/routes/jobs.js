const express = require('express');
const router = express.Router();
const pool = require('../database.js');

// Get job status by ID
router.get("/:id", async (req, res, next) => {
    let connection;
    try {
        connection = await pool.getConnection();
        var sql = "select * from jobs where id = ?"
        var params = [req.params.id]
        const [rows] = await connection.query(sql, params);
        res.json({
            "message": "success",
            "data": rows[0]
        })
    } catch (err) {
        res.status(400).json({ "error": err.message });
    } finally {
        if (connection) connection.release();
    }
});

module.exports = router;
