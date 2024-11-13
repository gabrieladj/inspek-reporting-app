// Express server file, backend of app - handles server-side logic
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const port = 3001;  // Backend running on this port
const secretKey = process.env.JWT_SECRET; // for signing and verifying tokens
const uri = process.env.MONGODB_URI;

const User = require('./models/User');
const Report = require('./models/Report');

const app = express();
app.use(express.json()); // This is crucial!

const allowedOrigins = process.env.CORS_ORIGIN.split(',');
// console.log('CORS_ORIGIN:', process.env.CORS_ORIGIN);
// console.log('Allowed Origins:', allowedOrigins);

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


//console.log("MongoDB URI:", process.env.MONGODB_URI);
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
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

// Route to serve index.html for '/login'
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'inspek-frontend', 'build', 'index.html'));
});

//test api route
app.get('/test', (req, res) => {
  res.send('Server is working!');
});

//API ROUTES BELOW
// GET all reports
app.get('/api/reports', async (req, res) => {
    try {
      const reports = await Report.find();
      res.json(reports);
    } catch (err) {
      console.error('Error fetching reports:', err);
      res.status(500).json({ message: 'Error fetching reports' });
    }
  });
  
  // GET a single report by ID
  app.get('/api/reports/:id', async (req, res) => {
    try {
      const report = await Report.findById(req.params.id);
      if (!report) {
        return res.status(404).json({ message: 'Report not found' });
      }
      res.json(report);
    } catch (err) {
      console.error('Error fetching report:', err);
      res.status(500).json({ message: 'Error fetching report' });
    }
  });
  
  // POST a new report
  app.post('/api/reports', async (req, res) => {
    const { title, description, status } = req.body;
    try {
      const newReport = new Report({
        title,
        description,
        status,
      });
      await newReport.save();
      res.status(201).json(newReport);
    } catch (err) {
      console.error('Error creating report:', err);
      res.status(500).json({ message: 'Error creating report' });
    }
  });
  
  // PUT (update) an existing report
  app.put('/api/reports/:id', async (req, res) => {
    const { title, description, status } = req.body;
    try {
      const report = await Report.findById(req.params.id);
      if (!report) {
        return res.status(404).json({ message: 'Report not found' });
      }
  
      report.title = title || report.title;
      report.description = description || report.description;
      report.status = status || report.status;
      report.updatedAt = Date.now();
  
      await report.save();
      res.json(report);
    } catch (err) {
      console.error('Error updating report:', err);
      res.status(500).json({ message: 'Error updating report' });
    }
  });
  
  // DELETE a report by ID
  app.delete('/api/reports/:id', async (req, res) => {
    try {
      const report = await Report.findByIdAndDelete(req.params.id);
      if (!report) {
        return res.status(404).json({ message: 'Report not found' });
      }
      res.status(204).send();
    } catch (err) {
      console.error('Error deleting report:', err);
      res.status(500).json({ message: 'Error deleting report' });
    }
  });

  // Serve static files from the `inspek-frontend/public` directory
  app.use(express.static(path.join(__dirname, 'inspek-frontend', 'build')));  

  // Serve index.html for the root URL - wildcard routes
  app.get('/*', (req, res) => {
      res.sendFile(path.join(__dirname, 'inspek-frontend', 'build', 'index.html'));
  });

  // Start server
  app.listen(port, '0.0.0.0', () => {
      console.log(`Server running on ${port}\n`);
  });