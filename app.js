const express = require('express');
const app = express();
const port = 3000; // Or any port you prefer

app.get('/', (req, res) => {
    res.send('Inspek Reporting Backend is up and running!');
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Server running at http://localhost:${port}`);
});
