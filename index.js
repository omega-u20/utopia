const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

// Connect to remote MongoDB
mongoose.connect('mongodb+srv://<username>:<password>@<cluster-url>/<dbname>?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Define User schema and model
const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    role: String,
});
const User = mongoose.model('User', userSchema);

// Citizen login
app.post('/citz/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Missing credentials' });
    }

    try {
        const user = await User.findOne({ username, password, role: 'citizen' });
        if (user) {
            return res.json({ message: 'Citizen login successful' });
        }
        res.status(401).json({ error: 'Invalid credentials' });
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Government login
app.post('/gov/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Missing credentials' });
    }

    try {
        const user = await User.findOne({ username, password, role: 'government' });
        if (user) {
            return res.json({ message: 'Government login successful' });
        }
        res.status(401).json({ error: 'Invalid credentials' });
    } catch (err) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(3000, () => {
    console.log('Server listening on port 3000');
});