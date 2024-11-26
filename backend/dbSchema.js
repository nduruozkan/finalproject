const db = require('./connectionDb.js'); // Import the database connection

// Function to initialize the database schema
function initializeSchema() {
    // Create the users table
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT NOT NULL UNIQUE,
            password TEXT NOT NULL,
            email TEXT
        )
    `, (err) => {
        if (err) {
            console.error("Error creating users table:", err.message);
        } else {
            console.log("Users table ready.");
        }
    });

    // Create the recipes table
    db.run(`
        CREATE TABLE IF NOT EXISTS recipes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            ingredients TEXT NOT NULL,
            instructions TEXT NOT NULL,
            time TEXT,
            coverImage TEXT,
            createdBy INTEGER,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (createdBy) REFERENCES users(id) ON DELETE SET NULL
        )
    `, (err) => {
        if (err) {
            console.error("Error creating recipes table:", err.message);
        } else {
            console.log("Recipes table ready.");
        }
    });

    console.log("Database schema initialized.");
}

// Run this function to initialize the schema when the application starts
module.exports = { initializeSchema };
