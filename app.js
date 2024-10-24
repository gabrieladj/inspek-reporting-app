const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Serve static files (from public directory)
app.use(express.static(path.join(__dirname, 'public')));

// Serve the index.html file for the root URL
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

//start server
app.listen(port, () => {
    console.log(`Server running on ${port}`);
});
