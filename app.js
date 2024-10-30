//Express server file, backend of app - handles server-side lgic

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
const port = 3000;
require('dotenv').config();

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Could not connect to MongoDB', err));

app.use(express.json()); // for parsing application/json

// Route to create sample users
app.post('/register', async (req, res) => {
    try {
      // Example of adding a predefined user
      const user = new User({
        username: 'admin',
        password: 'yourSecurePassword' // hash this later!!
      });
      await user.save();
      res.send('User created!');
    } catch (error) {
      res.status(500).send('Error creating user');
    }
  });

// Login route
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
  
    // Authenticate user here (check against database)
    if (username === 'admin' && password === 'yourSecurePassword') { // Replace with real authentication logic
      const token = jwt.sign({ username }, secretKey, { expiresIn: '1h' });
      res.json({ token });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  });

// Serve static files from the `inspek-frontend/public` directory
app.use(express.static(path.join(__dirname, 'inspek-frontend', 'build')));

// Route to serve index.html for '/login'
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'inspek-frontend', 'build', 'index.html'));
});

// // Import React pages (when the build is ready)
// app.get('/login', (req, res) => {
//     app.use(express.static(path.join(__dirname, 'inspek-frontend', 'public')));
// });

// Basic route for testing
app.get('/test', (req, res) => {
    res.send('Test route working');
  });

// // Serve static files (from public directory)
// app.use(express.static(path.join(__dirname, 'public')));

// Serve index.html for the root URL
app.get('/*', (req, res) => {
    res.sendFile(path.join(__dirname, 'inspek-frontend', 'build', 'index.html'));
});

//start server
app.listen(port, () => {
    console.log(`Server running on ${port}`);
});
