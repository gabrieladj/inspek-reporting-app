const express = require('express');
const path = require('path');
const app = express();

// Basic route for testing
app.get('/test', (req, res) => {
  res.send('Test route working');
});

// Serve static files (index.html)
app.use(express.static(path.join(__dirname, 'public')));

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});