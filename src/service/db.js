require("dotenv").config(); // Load environment variables from .env file
const { Pool } = require("pg");

const pool = new Pool({
    user: process.env.DB_USER || "postgres",
    host: process.env.DB_HOST || "localhost",
    database: process.env.DB_NAME || "mydb", // Ensure this is correct
    password: process.env.DB_PASSWORD || "postgres",
    port: process.env.DB_PORT || 5433,
});



// Function to initialize the database schema
const initializeDatabase = async () => {
    try {
        console.log("Initializing database...");

        const client = await pool.connect(); // Get a connection

        // Create the chat_messages table if it doesn't exist
        await client.query(`
            CREATE TABLE IF NOT EXISTS chat_messages (
                id SERIAL PRIMARY KEY, -- PostgreSQL uses SERIAL instead of AUTO_INCREMENT
                user_id INT NOT NULL,
                message_content TEXT NOT NULL,
                response_content TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT NOW() -- Use NOW() instead of CURRENT_TIMESTAMP
            )
        `);

        console.log("Database and tables initialized successfully.");
        client.release(); // Release the client back to the pool
    } catch (error) {
        console.error("Error initializing database:", error);
    }
};

// Call the database initialization function
initializeDatabase();

module.exports = pool;
