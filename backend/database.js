const mysql = require('mysql2/promise');
const url = require('url');

const dbUrl = new url.URL('mysql://IEEEHACK_teacherhot:0f4a968a190c248f3fe5a88dc63673cfe486bf1c@4f7lx5.h.filess.io:3307/IEEEHACK_teacherhot');

const pool = mysql.createPool({
    host: dbUrl.hostname,
    user: dbUrl.username,
    password: dbUrl.password,
    port: dbUrl.port,
    database: dbUrl.pathname.slice(1),
    waitForConnections: true,
    connectionLimit: 5, // As requested
    queueLimit: 0
});

module.exports = pool;