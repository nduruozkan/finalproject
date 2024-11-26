require('dotenv').config(); // Load environment variables
const express = require('express');
const { initializeSchema } = require('./dbSchema');
const userRoutes = require('./routes/userRoutes');
const recipeRoutes = require('./routes/recipeRoutes');
const authController = require("./controllers/authController");
const cors = require('cors');
const app = express(); // Create an instance of the Express app
const PORT = process.env.PORT || 3001; // Use PORT from .env if available

// CORS Configuration
const corsOptions = {
  origin: 'http://localhost:5173', // Only allow requests from the frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow specific methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allow specific headers
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Middleware to parse JSON bodies
app.use(express.json());

// Initialize the database schema
initializeSchema();

// Use separate paths for user and recipe routes
app.use('/api/users', userRoutes);
app.use('/api/recipes', recipeRoutes);


app.post('/register', authController.register);
// Register the /signUp route for user registration
app.post('/login', authController.login); 

// Protected route example (to be used with JWT authentication)
app.get("/api/protected", authController.authenticateJWT, authController.protectedResource);

// Export the app for testing purposes
module.exports = app;

// Start the server only if this file is run directly
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
