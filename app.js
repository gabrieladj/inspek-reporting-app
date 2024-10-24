const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Serve static files (like CSS)
app.use(express.static('public'));

// Serve the index.html file for the root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/index.html'));
});

//start server
app.listen(port, '0.0.0.0', () => {
    console.log(`Server running at http://localhost:${port}`);
});
