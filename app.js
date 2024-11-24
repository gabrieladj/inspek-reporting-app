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

// MongoDB connection
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

////
// API ROUTES BELOW
////

// Route to get dashboard data
app.get('/api/dashboard-data', async (req, res) => {
  try {
    // Get the total number of clients
    const clientCount = await Client.countDocuments();

    // add other data like revenue or web traffic here
    // currently just client count
    res.json({
      revenue: 10000, // can pull this from database too
      newClients: clientCount, // Dynamically fetched from MongoDB
      webTraffic: 2000, // replace this with actual traffic data if available
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ message: 'Error fetching dashboard data' });
  }
});

// Routes to handle data from Google Apps Script -> goes to Client and Reports Collections

// POST route for client data
app.post('/api/client-data', async (req, res) => {
  try {
    const clientData = req.body;

    // Validate required fields for client data
    if (!clientData.clientName || !clientData.propertyRepresentativeName) {
      return res.status(400).json({ message: 'Missing required client fields' });
    }

    // Check if the client already exists
    let client = await Client.findOne({ clientName: clientData.clientName });
    if (client) {
      // Update existing client
      Object.assign(client, clientData);
      client = await client.save();
    } else {
      // Create a new client record
      client = new Client(clientData);
      client = await client.save();
    }

    res.status(201).json({ message: 'Client data processed successfully', clientId: client._id });
  } catch (error) {
    console.error('Error handling client data:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// GET route to filter by clientName
app.get('/api/client-data', async (req, res) => {
  try {
    const { clientName } = req.query;

    if (!clientName) {
      return res.status(400).json({ message: 'Client name is required for filtering' });
    }

    // Search for clients by clientName
    const clients = await Client.find({ clientName: new RegExp(clientName, 'i') }); // Case-insensitive match

    if (clients.length === 0) {
      return res.status(404).json({ message: 'No clients found matching the given name' });
    }

    res.status(200).json(clients);
  } catch (error) {
    console.error('Error fetching client data:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// POST route for report data
app.post('/api/report-data', async (req, res) => {
  try {
    const reportData = req.body;

    // Validate required fields for report data
    if (!reportData.title || !reportData.description || !reportData.clientId) {
      return res.status(400).json({ message: 'Missing required report fields' });
    }

    // Link the report to an existing client
    const client = await Client.findById(reportData.clientId);
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }

    // Save the report
    const report = new Report({
      ...reportData,
      clientId: client._id,
    });
    console.log('Final report payload:', reportData); //

    const savedReport = await report.save();
    res.status(201).json({ message: 'Report data saved successfully', reportId: savedReport._id });
  } catch (error) {
    console.error('Error handling report data:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Route to generate a report outline
app.post('/api/create-report-outline', async (req, res) => {
  try {
    const reportId = req.body.reportId;

    // Retrieve the report from the database
    const report = await Report.findById(reportId).populate('clientId');

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    // Construct the report outline sections
    const sections = [
      {
        sectionName: 'Title',
        content: report.title
      },
      {
        sectionName: 'Description',
        content: report.description
      },
      {
        sectionName: 'Client Information',
        content: `Client: ${report.clientId.name}, Contact: ${report.clientId.contactInfo}`
      },
      {
        sectionName: 'Property Information',
        content: `
          Property Name: ${report.propertyInfo.propertyName || 'N/A'},
          Property Address: ${report.propertyInfo.propertyAddress || 'N/A'},
          Property Type: ${report.propertyInfo.propertyType || 'N/A'},
          Year Built: ${report.propertyInfo.yearBuilt || 'N/A'},
          Square Footage: ${report.propertyInfo.totalBuildingSqFt || 'N/A'},
          Floors: ${report.propertyInfo.numFloors || 'N/A'}
        `
      },
      {
        sectionName: 'Inspection Scope',
        content: `
          Type of Inspection: ${report.inspectionScope.typeOfInspection || 'N/A'},
          Drone Imagery: ${report.inspectionScope.droneImagery ? 'Yes' : 'No'},
          Areas of Concern: ${report.inspectionScope.specificAreasOfConcern || 'N/A'}
        `
      },
      {
        sectionName: 'Inspection Details',
        content: `
          Preferred Date: ${report.inspectionDetails.preferredDate || 'N/A'},
          Preferred Time: ${report.inspectionDetails.preferredTime || 'N/A'},
          Alternate Date: ${report.inspectionDetails.alternateDate || 'N/A'},
          Alternate Time: ${report.inspectionDetails.alternateTime || 'N/A'},
          Additional Info: ${report.inspectionDetails.additionalInfo || 'N/A'}
        `
      },
      {
        sectionName: 'Building Details',
        content: `
          Recent Maintenance: ${report.buildingDetails.recentMaintenance || 'N/A'},
          Ongoing Issues: ${report.buildingDetails.ongoingIssues || 'N/A'},
          Additional Spaces: ${report.buildingDetails.additionalSpaces || 'N/A'},
          Office Space Percentage: ${report.buildingDetails.officeSpacePercentage || 'N/A'},
          Warehouse Space Percentage: ${report.buildingDetails.warehouseSpacePercentage || 'N/A'},
          Retail Space Percentage: ${report.buildingDetails.retailSpacePercentage || 'N/A'},
          Manufacturing Space Percentage: ${report.buildingDetails.manufacturingSpacePercentage || 'N/A'},
          Other Space Percentage: ${report.buildingDetails.otherSpacePercentage || 'N/A'},
          Water Intrusion: ${report.buildingDetails.waterIntrusion || 'N/A'},
          Structural Issues: ${report.buildingDetails.structuralIssues || 'N/A'},
          Planned Work: ${report.buildingDetails.plannedWork || 'N/A'},
          HVAC Details: ${report.buildingDetails.hvacDetails || 'N/A'},
          Specialized Systems: ${report.buildingDetails.specializedSystems || 'N/A'},
          Utility Issues: ${report.buildingDetails.utilityIssues || 'N/A'},
          Environmental Assessments: ${report.buildingDetails.environmentalAssessments || 'N/A'},
          Environmental Concerns: ${report.buildingDetails.environmentalConcerns || 'N/A'},
          Code Violations: ${report.buildingDetails.codeViolations || 'N/A'},
          Previous Inspections: ${report.buildingDetails.previousInspections || 'N/A'},
          Insurance Claims: ${report.buildingDetails.insuranceClaims || 'N/A'},
          Pest Infestations: ${report.buildingDetails.pestInfestations || 'N/A'},
          Special Attention: ${report.buildingDetails.specialAttention || 'N/A'},
          Hazardous Materials: ${report.buildingDetails.hazardousMaterials || 'N/A'},
          Recent Construction: ${report.buildingDetails.recentConstruction || 'N/A'},
          Accessibility Issues: ${report.buildingDetails.accessibilityIssues || 'N/A'},
          Structural Modifications: ${report.buildingDetails.structuralModifications || 'N/A'},
          Warranties: ${report.buildingDetails.warranties || 'N/A'}
        `
      }
    ];

    // Respond with the generated report outline
    res.status(200).json({ outline: sections });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error generating report outline' });
  }
});



// Create or update a report
app.post('/api/reports', async (req, res) => {
  try {
    const { title, description, status, clientInfo, propertyInfo, inspectionScope, inspectionDetails } = req.body;

    if (!title || !description || !clientInfo) {
      return res.status(400).json({ message: 'Title, description, and clientInfo are required' });
    }

    let clientId = null;

    // Check if client exists in the Clients collection, and either create or update client
    if (clientInfo && clientInfo.clientName) {
      const existingClient = await Client.findOne({ clientName: clientInfo.clientName });
      if (existingClient) {
        // Update existing client if found
        await Client.updateOne({ clientName: clientInfo.clientName }, { $set: clientInfo });
        clientId = existingClient._id; // Use the existing client's ID
      } else {
        // Create new client if not found
        const newClient = new Client(clientInfo);
        const savedClient = await newClient.save();
        clientId = savedClient._id; // Use the new client's ID
      }
    }

    // Create and save the report
    const report = new Report({
      title,
      description,
      status,
      clientId,
      propertyInfo,
      inspectionScope,
      inspectionDetails,
    });

    const savedReport = await report.save();
    res.status(201).json(savedReport); // Return the saved report
  } catch (error) {
    console.error('Error creating report:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});



// Fetch all reports
app.get('/api/reports', async (req, res) => {
  try {
    const reports = await Report.find();
    res.json(reports);
  } catch (err) {
    console.error('Error fetching reports:', err);
    res.status(500).json({ message: 'Error fetching reports' });
  }
});

// Fetch a single report by ID
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

// Update an existing report
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

// Delete a report by ID
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

// POST endpoint to create a new client
app.post('/api/clients', async (req, res) => {
  const requiredFields = [
    'clientName',
    'propertyRepresentativeName',
    'propertyRepresentativePhone',
    'propertyRepresentativeEmail',
    'mailingAddress',
    'roleOrRelationship',
    'onSiteContactName',
    'onSiteContactPhone',
    'onSiteContactEmail',
    'propertyAddress'
  ];

  const missingFields = requiredFields.filter(field => !req.body[field]);

  if (missingFields.length) {
    return res.status(400).json({ 
      message: 'Missing required fields', 
      missingFields 
    });
  }

  try {
    const newClient = new Client(req.body); // Properly define newClient
    const savedClient = await newClient.save(); // Save the client to the database
    console.log('Client saved successfully:', savedClient);
    res.status(201).json({ message: 'Client saved successfully', clientId: savedClient._id });
  } catch (error) {
    console.error('Error saving client:', error.message);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get all clients
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

// Test API route
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
