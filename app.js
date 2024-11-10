// Express server file, backend of app - handles server-side logic
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const User = require('./models/User'); // Ensure the path is correct
const port = 3001;  // Backend running on this port
const secretKey = process.env.JWT_SECRET; // for signing and verifying tokens
const uri = process.env.MONGODB_URI;

const app = express();
app.use(express.json()); // This is crucial!

const allowedOrigins = process.env.CORS_ORIGIN.split(',');
console.log('CORS_ORIGIN:', process.env.CORS_ORIGIN);
console.log('Allowed Origins:', allowedOrigins);

app.use(cors({
    origin: function (origin, callback) {
        console.log(`Incoming request from origin: ${origin}`);
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
}));

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Could not connect to MongoDB', err));

// Login route
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        console.log(`Trying to log in user: ${username}`);
        const user = await User.findOne({ username });
        console.log('Found user:', user);

        if (user && bcrypt.compareSync(password, user.password)) {
            const token = jwt.sign({ username }, secretKey, { expiresIn: '1h' });
            res.json({ token });
        } else {
            console.log('Invalid credentials');
            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Serve static files from the `inspek-frontend/public` directory
app.use(express.static(path.join(__dirname, 'inspek-frontend', 'build')));

// Route to serve index.html for '/login'
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'inspek-frontend', 'build', 'index.html'));
});

// // Basic route for testing
// app.get('/api/test', (req, res) => {
//     res.send('Test route working');
// });

// Serve index.html for the root URL
app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'inspek-frontend', 'build', 'index.html'));
});

// Start server
app.listen(port, '0.0.0.0', () => {
    console.log(`Server running on ${port}`);
});
