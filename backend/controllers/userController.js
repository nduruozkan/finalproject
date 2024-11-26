const userModel = require('../models/user');
const jwt = require('jsonwebtoken');

const SECRET_KEY = 'your-secret-key'; // Use an environment variable in production

// Controller for registering a new user
function registerUser(req, res) {
    userModel.createUser(req.body, (err, userId) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ id: userId, message: "User registered successfully" });
    });
}

// Controller for authenticating a user (login)
function loginUser(req, res) {
    const { username, password } = req.body;

    userModel.authenticateUser(username, password, (err, user) => {
        if (err || !user) {
            return res.status(401).json({ error: "Authentication failed" });
        }

        // Generate JWT
        const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: '1h' });

        // Kullanıcı bilgilerini ve token'ı yanıt olarak dönüyoruz
        res.json({
            message: "Login successful",
            data: {
                token,
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email 
                }
            }
        });
    });
}


// Middleware to protect routes
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ error: "Access denied" });

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.status(403).json({ error: "Invalid token" });
        req.user = user;
        next();
    });
}
function deleteUser(req, res) {
    const userId = req.params.id;
    console.log('Deleting user with ID:', userId);

    userModel.deleteUserById(userId, (err) => {
        if (err) {
            console.error('Error deleting user:', err);
            return res.status(500).json({ error: "Failed to delete user" });
        }
        console.log('User deleted successfully');
        res.json({ message: "User deleted successfully" });
    });
}


module.exports = {
    registerUser,
    loginUser,
    authenticateToken,
    deleteUser
};
