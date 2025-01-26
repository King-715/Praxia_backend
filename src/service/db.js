require("dotenv").config(); // Load environment variables from .env file
const mysql = require("mysql2");

// Create a MySQL connection pool
const pool = mysql.createPool({
    host: process.env.DB_HOST || "localhost", // Default to localhost if not set
    user: process.env.DB_USER || "root", // Default to root if not set
    password: process.env.DB_PASSWORD || "", // Default to an empty password if not set
    database: process.env.DB_NAME || "test", // Default to 'test' database if not set
    port: process.env.DB_PORT || 3306, // Default to MySQL's default port 3306
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});

// Export the connection pool with promises
const db = pool.promise();

// Function to initialize the database schema
const initializeDatabase = async () => {
    try {
        console.log("Initializing database...");

        // Create the database if it doesn't exist
        await db.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\``);

        // Use the database
        await db.query(`USE \`${process.env.DB_NAME}\``);

        // Create the chat_messages table if it doesn't exist
        await db.query(`
            CREATE TABLE IF NOT EXISTS chat_messages (
                id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                message_content TEXT NOT NULL,
                response_content TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);

        console.log("Database and tables initialized successfully.");
    } catch (error) {
        console.error("Error initializing database:", error);
    }
};

// Call the database initialization function
initializeDatabase();

module.exports = db;
