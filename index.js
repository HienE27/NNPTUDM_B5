const express = require('express');
const { pool, initDatabase } = require('./config/database');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Initialize database and start server
const startServer = async () => {
    try {
        await initDatabase();
        console.log('Connected to MySQL');

        // Import routes
        const userRoutes = require('./routes/users');
        const roleRoutes = require('./routes/roles');

        // Use routes
        app.use('/api/users', userRoutes);
        app.use('/api/roles', roleRoutes);

        app.listen(PORT, () => {
            console.log(`Server is running at http://localhost:${PORT}`);
        });
    } catch (error) {
        console.error('Failed to start server:', error.message);
        process.exit(1);
    }
};

startServer();
