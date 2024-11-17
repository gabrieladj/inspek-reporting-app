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
const router = express.Router();

const User = require('./models/User');
const Report = require('./models/Report');
const Client = require('./models/Client');
const { spawn } = require('child_process');

const app = express();
app.use(express.json()); 

// Get the CORS origin(s) from the environment variable
const allowedOrigins = process.env.CORS_ORIGIN.split(',');

// Set up CORS with the allowed origins from the environment variable
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      // Allow the request if the origin is allowed
      callback(null, true);
    } else {
      // Reject the request if the origin is not allowed
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: 'GET,POST,PUT,DELETE',
  credentials: true,
};

// Apply CORS middleware to your Express app
app.use(cors(corsOptions));

//console.log("MongoDB URI:", process.env.MONGODB_URI);
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Could not connect to MongoDB', err));

  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Credentials', 'true'); // Allow credentials
    next();
  });

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


////////////////////////////
//API ROUTES BELOW
////////////////////////////

app.post('/api/reports', async (req, res) => {
  try {
    // Extract report data
    const { title, description, status, clientInfo, propertyInfo, inspectionScope, inspectionDetails } = req.body;

    // Check if client exists in the Clients collection
    if (clientInfo && clientInfo.clientName) {
      const existingClient = await Client.findOne({ clientName: clientInfo.clientName });
      if (existingClient) {
        // Update client information if it already exists
        await Client.updateOne(
          { clientName: clientInfo.clientName },
          { ...clientInfo } // Update with the latest clientInfo data
        );
      } else {
        // Create a new client record if not found
        const newClient = new Client(clientInfo);
        await newClient.save();
      }
    }

    // Save the report
    const report = new Report({
      title,
      description,
      status,
      clientInfo, // Store client information in the report
      propertyInfo,
      inspectionScope,
      inspectionDetails,
    });

    const savedReport = await report.save();
    res.status(201).json(savedReport);
  } catch (error) {
    console.error('Error creating report:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/api/clients', async (req, res) => {
  try {
    const clients = await Client.find();
    if (!clients || clients.length === 0) {
      return res.status(404).json({ message: 'No clients found' });
    }
    res.json(clients);
  } catch (error) {
    console.error('Error fetching clients:', error);
    res.status(500).json({ message: 'Failed to fetch clients.' });
  }
});

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

  app.get('/api/dashboard-data', async (req, res) => {
    try {
      const data = {
        revenue: 0, // Replace with actual data retrieval logic
        newClients: 0,
        webTraffic: 0,
      };
      res.json(data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });
  

// Route for generating a proposal
app.post('/api/generate-proposal', (req, res) => {
  try {
    const clientData = req.body;  // Ensure you're receiving the body as JSON
    console.log(clientData);
    
    // Pass this data to the Python script, ensure it's correctly formatted
    const pythonProcess = spawn('python', ['report_scripts/generate_proposal.py', JSON.stringify(clientData)]);
    
    pythonProcess.stdout.on('data', (data) => {
      console.log(data.toString());
    });

    pythonProcess.stderr.on('data', (data) => {
      console.error(data.toString());
    });

    pythonProcess.on('close', (code) => {
      console.log(`Python process closed with code ${code}`);
      res.send('Report generated successfully');
    });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error generating report');
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