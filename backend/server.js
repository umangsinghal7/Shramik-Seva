const express = require('express');
const cors = require('cors');
const pool = require('./database.js');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
const authRoutes = require('./routes/auth');
const workerRoutes = require('./routes/workers');
const jobRoutes = require('./routes/jobs');
const paymentRoutes = require('./routes/payment');

app.use('/', authRoutes);
app.use('/workers', workerRoutes);
app.use('/jobs', jobRoutes);
app.use('/payment', paymentRoutes);

// Default route
app.get("/", (req, res, next) => {
    res.json({ "message": "Ok" })
});

async function setupDatabase() {
    let connection;
    try {
        connection = await pool.getConnection();
        console.log("Acquired connection for database setup.");

        // Drop existing tables for a clean slate in development
        await connection.query('DROP TABLE IF EXISTS jobs');
        await connection.query('DROP TABLE IF EXISTS workers');
        await connection.query('DROP TABLE IF EXISTS users');

        // Create users table
        await connection.query(`CREATE TABLE users (
            id INTEGER PRIMARY KEY AUTO_INCREMENT,
            name TEXT, 
            email VARCHAR(255) UNIQUE, 
            password TEXT
        )`);

        // Seed users
        const users = [
            { name: 'admin', email: 'admin@example.com', password: 'admin123' },
            { name: 'user', email: 'user@example.com', password: 'user123' }
        ];
        const insertUsers = 'INSERT IGNORE INTO users (name, email, password) VALUES (?,?,?)';
        for (const user of users) {
            await connection.query(insertUsers, [user.name, user.email, user.password]);
        }

        // Create workers table
        await connection.query(`CREATE TABLE workers (
            id INTEGER PRIMARY KEY AUTO_INCREMENT,
            name TEXT NOT NULL,
            email VARCHAR(255) UNIQUE,
            password TEXT,
            skill TEXT NOT NULL,
            location TEXT NOT NULL,
            experience INTEGER NOT NULL,
            rating REAL,
            reviewsCount INTEGER,
            verified BOOLEAN DEFAULT false,
            phone TEXT
        )`);

        // Seed workers
        const workers = [
            { name: 'Ramesh Kumar', email: 'ramesh@example.com', password: 'password123', skill: 'Plumber', location: 'Maujpur', experience: 5, rating: 4.5, reviewsCount: 28, verified: true, phone: '9876543210' },
            { name: 'Suresh Singh', email: 'suresh@example.com', password: 'password123', skill: 'Electrician', location: 'Seelampur', experience: 8, rating: 4.8, reviewsCount: 45, verified: true, phone: '9876543211' },
            { name: 'Amit Sharma', email: 'amit@example.com', password: 'password123', skill: 'Carpenter', location: 'Krishna Nagar', experience: 3, rating: 4.2, reviewsCount: 15, verified: false, phone: '9876543212' },
            { name: 'Vijay Verma', email: 'vijay@example.com', password: 'password123', skill: 'Painter', location: 'Khajuri', experience: 10, rating: 4.9, reviewsCount: 62, verified: true, phone: '9876543213' },
            { name: 'Sonu Yadav', email: 'sonu@example.com', password: 'password123', skill: 'Driver', location: 'Shastri Park', experience: 6, rating: 4.6, reviewsCount: 33, verified: true, phone: '9876543214' },
            { name: 'Manoj Tiwari', email: 'manoj@example.com', password: 'password123', skill: 'Plumber', location: 'Kashmere Gate', experience: 2, rating: 3.9, reviewsCount: 8, verified: false, phone: '9876543215' }
        ];
        const insertWorkers = 'INSERT IGNORE INTO workers (name, email, password, skill, location, experience, rating, reviewsCount, verified, phone) VALUES (?,?,?,?,?,?,?,?,?,?)';
        for (const worker of workers) {
            await connection.query(insertWorkers, [worker.name, worker.email, worker.password, worker.skill, worker.location, worker.experience, worker.rating, worker.reviewsCount, worker.verified, worker.phone]);
        }

        // Create jobs table
        await connection.query(`CREATE TABLE jobs (
            id VARCHAR(255) PRIMARY KEY,
            status TEXT NOT NULL,
            message TEXT NOT NULL
        )`);

        // Seed jobs
        const jobs = [
            { id: 'SS-126945', status: 'ACCEPTED', message: 'Job ID SS-126945: Your request has been accepted. The worker is on the way.' },
            { id: 'SS-126946', status: 'PENDING', message: 'Job ID SS-126946: Your request is pending. A worker will be assigned shortly.' }
        ];
        const insertJobs = 'INSERT IGNORE INTO jobs (id, status, message) VALUES (?,?,?)';
        for (const job of jobs) {
            await connection.query(insertJobs, [job.id, job.status, job.message]);
        }
    } catch (err) {
        console.error('Error setting up database:', err);
        throw err; // Throw error to be caught by startServer
    } finally {
        if (connection) {
            connection.release();
            console.log("Released database setup connection.");
        }
    }
}

async function startServer() {
    try {
        console.log('Setting up database...');
        await setupDatabase();
        console.log('Database setup complete.');

        const HTTP_PORT = 8000;
        app.listen(HTTP_PORT, () => {
            console.log(`Server running on port ${HTTP_PORT}`);
        });
    } catch (err) {
        console.error('Failed to start server:', err);
        process.exit(1);
    }
}

startServer();
