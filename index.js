const env = require('dotenv');
const express = require('express');
const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Auth route
app.post('/auth', async (req, res) => {
    
});

// Dashboard routes
app.get('/gov/dashboard', (req, res) => {
    
});

app.get('/citz/dashboard', (req, res) => {
   
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});