const env = require('dotenv');
const express = require('express');
const db = require('./db');
const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));


// Auth route
app.post('/auth', async (req, res) => {
    const { role } = req.body;
    if (role === 'gov') {
        var {username, password, govRole} = req.body;
        const isValid = await db.login(username, password);
        if (isValid) {
            res.json({ username, govRole} ).redirect('/gov/dashboard')
      
        } else {
            res.status(401).send('Invalid credentials');
        }
    }else if (role === 'citz') {
        var {email, password} = req.body;
        const isValid = await db.login(email, password);
        if (isValid) {
            res.json({email});
        }
    } else {
        res.status(400).send('Invalid role');
    }
});

// Dashboard routes
app.get('/gov/dashboard', async (req, res) => {
    var {employeeID, Name} = db.getGovInfo(username);
});

app.get('/citz/dashboard', (req, res) => {
   
}); 

app.get('/', (req, res) => {
    res.send('Welcome to Utopia API');
});

app.post('/login', (req, res) => {
    
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});