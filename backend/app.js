const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv").config();
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");
const recipeRoutes = require("./routes/recipe");

const app = express();
app.use(express.json());
app.use(cors());

// Routes for authentication (login and register)
app.use("/auth", authRoutes);  // Routes will be available at /auth/register and /auth/login

// Routes for user and recipes
app.use("/api/users", userRoutes);  // User-related routes at /api/users
app.use("/api/recipes", recipeRoutes); // Recipe-related routes at /api/recipes

module.exports = app;
