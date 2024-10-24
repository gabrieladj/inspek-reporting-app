const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Serve static files (from public directory..?)
app.use(express.static(path.join(__dirname, 'public')));

// Serve the index.html file for the root URL
// app.get('/test', (req, res) => {
//     res.sendFile(path.join(__dirname, 'public', 'index.html'));
// });

app.get('/inspek-reporting-app/test', (req, res) => {
    res.send("This is a test route");
  });

//start server
app.listen(port, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${port}`);
});
