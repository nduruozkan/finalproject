const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Public routes for registration and login
router.post('/register', userController.registerUser); // Changed from /users/register to /register
router.post('/login', userController.loginUser); // Changed from /users/login to /login

// Protected route example (e.g., user profile)
router.get('/profile', userController.authenticateToken, (req, res) => {
    res.json({ message: "Access granted to profile", user: req.user });
});
router.delete('/:id', userController.deleteUser);
module.exports = router;
