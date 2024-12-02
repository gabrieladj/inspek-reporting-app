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
      callback(null, true);
    } else {
      console.error(`Blocked by CORS: ${origin}`); // Debugging log
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

app.post('/api/create-report-outline', async (req, res) => {
  try {
    const { title, description, clientId, propertyInfo, inspectionScope, inspectionDetails, buildingDetails } = req.body;

    // Step 1: Validate clientId exists
    const client = await Client.findById(clientId);
    if (!client) {
      return res.status(400).json({ message: 'Invalid clientId. Client not found.' });
    }

    // Step 2: Create and save the report
    const newReport = new Report({
      title,
      description,
      clientId,
      propertyInfo,
      inspectionScope,
      inspectionDetails,
      buildingDetails,
    });

    const savedReport = await newReport.save();

    // Step 3: Populate clientId
    const populatedReport = await savedReport.populate({ path: 'clientId', select: 'name' });

    // Step 4: Construct the report outline
    const sections = [
      { sectionName: 'Title', content: savedReport.title },
      { sectionName: 'Description', content: savedReport.description },
      { sectionName: 'Client Information', content: `Client: ${client.clientName}` },
      { sectionName: 'Property Information', content: `Property Name: ${savedReport.propertyInfo.propertyName}` },
      { sectionName: 'Inspection Scope', content: `Inspection Type: ${savedReport.inspectionScope.typeOfInspection}` },
      { sectionName: 'Inspection Details', content: `Preferred Date: ${savedReport.inspectionDetails.preferredDate}` },
      { sectionName: 'Building Details', content: `Recent Maintenance: ${savedReport.buildingDetails.recentMaintenance}` },
    ];

    // Step 5: Respond with the report outline
    res.status(200).json({ outline: sections });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Error creating report outline' });
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
// Fetch all reports with populated client data
app.get('/api/reports', async (req, res) => {
  try {
    const reports = await Report.find()
      .populate({ path: 'clientId', select: 'clientName' }); // Populate clientId with clientName

    // Now, each report will include the clientName from the Client schema
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

app.get('/api/reports/by-client/:clientId', async (req, res) => {
  try {
    const reports = await Report.find({ clientId: req.params.clientId })
      .populate({ path: 'clientId', select: 'clientName' }); // Populate client info

    res.json(reports);
  } catch (err) {
    console.error('Error fetching reports by client:', err);
    res.status(500).json({ message: 'Error fetching reports by client' });
  }
});

//DELETE route to delete a client by ID
app.delete('/api/client-data/:id', async (req, res) => {
  try {
      const clientId = req.params.id;

      // Try to find and delete the client
      const client = await Client.findByIdAndDelete(clientId);

      if (!client) {
          return res.status(404).json({ message: 'Client not found' });
      }

      res.status(200).json({ message: 'Client deleted successfully' });
  } catch (error) {
      console.error('Error deleting client:', error);
      res.status(500).json({ message: 'Internal server error' });
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

// Get a specific client by ID
app.get('/api/clients/:clientId', async (req, res) => {
  try {
    const client = await Client.findById(req.params.clientId);
    if (!client) {
      return res.status(404).json({ message: 'Client not found' });
    }
    res.json(client);
  } catch (error) {
    console.error('Error fetching client:', error);
    res.status(500).json({ message: 'Failed to fetch client.' });
  }
});


//route for python script to generate proposal
app.post('/api/generate-report', async (req, res) => {
  try {
    console.log('Received Request Body:', req.body);  // Add this log
    const {
      reportId,
      clientName,
      mailingAddress,
      propertyName,
      propertyAddress,
      officeSpacePercentage,
      warehouseSpacePercentage,
      retailSpacePercentage,
      otherSpacePercentage,
      propertyRepresentativeName
    } = req.body;  // Extract all required fields from the request body

    // Fetch the report based on the reportId
    const report = await Report.findById(reportId).populate('clientId', 'clientName mailingAddress propertyAddress propertyRepresentativeName');
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    // Check for missing client data
    if (!report.clientId) {
      return res.status(400).json({ message: 'Client information is missing' });
    }

    // Fetch client details from the report
    const clientId = report.clientId._id; // Client ID for the Python script
    const reportClientName = report.clientId.clientName;
    const reportMailingAddress = report.clientId.mailingAddress;
    const reportPropertyAddress = report.clientId.propertyAddress;
    const reportPropertyRepresentativeName = report.clientId.propertyRepresentativeName;

    // Log client details to debug
    console.log('Report Client Details:', {
      clientId,
      clientName: reportClientName,
      mailingAddress: reportMailingAddress,
      propertyAddress: reportPropertyAddress,
      propertyRepresentativeName: reportPropertyRepresentativeName
    });

    //console.log("Populated Report Client:", report.clientId);

    // File path for the generated proposal
    const filePath = path.join(__dirname, 'uploads', `Proposal_${clientName}_${propertyName}.docx`);

    // Call Python script using spawn, passing all necessary fields
    const pythonProcess = spawn('python', [
      path.join(__dirname, '/report_scripts/generate_proposal.py'), // Path to Python script
      clientId.toString(), 
      reportId.toString(), 
      clientName, 
      mailingAddress,
      propertyName, 
      propertyAddress, 
      officeSpacePercentage, 
      warehouseSpacePercentage, 
      retailSpacePercentage, 
      otherSpacePercentage, 
      propertyRepresentativeName 
    ]);

    // Capture Python script stdout and stderr
    pythonProcess.stdout.on('data', (data) => {
      console.log(`Python stdout: ${data}`);
    });

    pythonProcess.stderr.on('data', (data) => {
      console.error(`Python stderr: ${data}`);
    });

    pythonProcess.on('close', (code) => {
      if (code === 0) {
        console.log(`Python script executed successfully, file saved: ${filePath}`);
        res.json({ message: 'Report generated successfully', filePath });
      } else {
        console.error(`Python script exited with code ${code}`);
        res.status(500).json({ message: 'Error generating report' });
      }
    });
  } catch (error) {
    console.error('Error generating report:', error);
    res.status(500).json({ message: 'Error generating report' });
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
