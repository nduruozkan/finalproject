const db = require('../connectionDb.js');
const bcrypt = require('bcrypt');

// Function to register a new user
function createUser(user, callback) {
    const { username, password, email } = user;
    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) return callback(err);

        db.run(
            `INSERT INTO users (username, password, email) VALUES (?, ?, ?)`,
            [username, hashedPassword, email],
            function (err) {
                callback(err, this ? this.lastID : null);
            }
        );
    });
}

// Function to authenticate a user (login)
function authenticateUser(username, password, callback) {
    db.get(
        `SELECT * FROM users WHERE username = ?`,
        [username],
        (err, user) => {
            if (err || !user) return callback(err || new Error("User not found"));

            bcrypt.compare(password, user.password, (err, isMatch) => {
                if (err || !isMatch) return callback(err || new Error("Invalid password"));
                callback(null, user);
            });
        }
    );
}

// Function to get user by ID
function getUserById(id, callback) {
    db.get(
        `SELECT id, username, email FROM users WHERE id = ?`,
        [id],
        (err, row) => {
            callback(err, row);
        }
    );
}
function deleteUserById(id, callback) {
    const query = 'DELETE FROM users WHERE id = ?';
    db.run(query, [id], (err) => {
        callback(err);
    });
}

module.exports = {
    createUser,
    authenticateUser,
    getUserById,
    deleteUserById
};
