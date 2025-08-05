const express = require('express');
const { MongoClient } = require('mongodb');
const cookieParser = require('cookie-parser');
const crypto = require('crypto');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const uri = 'mongodb://localhost:27017'; // Update with your MongoDB URI if needed
const client = new MongoClient(uri);
const dbName = 'yourDatabase'; // Replace with your database name
const collectionName = 'users'; // Replace with your collection name

app.post('/citz/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        await client.connect();
        const db = client.db(dbName);
        const users = db.collection(collectionName);

        // Find user with matching username and password
        const user = await users.findOne({ username, password });

        if (user) {
            res.redirect('/citz/dashboard');
        } else {
            // Send invalid credentials message to /citz/login
            res.status(401).redirect('/citz/login?error=Invalid%20credentials');
            res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error' });
    } finally {
        await client.close();
    }
});

app.use(cookieParser());

const tempIdStore = {};

app.post('/gov/login', async (req, res) => {
    const { username, password, role } = req.body;
    const tempIdFromCookie = req.cookies.tempID;

    // Clean up expired tempIDs
    for (const [key, value] of Object.entries(tempIdStore)) {
        if (Date.now() > value.expires) {
            delete tempIdStore[key];
        }
    }

    // If tempID exists and is valid, skip login and redirect
    if (tempIdFromCookie && tempIdStore[tempIdFromCookie]) {
        res.redirect(`/gov/dashboard?role=${encodeURIComponent(role)}`);
        return;
    }

    try {
        await client.connect();
        const db = client.db(dbName);
        const users = db.collection(collectionName);

        // Find user with matching username, password, and role
        const user = await users.findOne({ username, password, role });

        if (user) {
            // Set userID as a cookie
            const userID = user._id.toString();
            res.cookie('userID', userID, { httpOnly: true });

            // Create temporary ID using SHA256
            const tempId = crypto.createHash('sha256').update(userID + Date.now().toString()).digest('hex');
            res.cookie('tempID', tempId, { httpOnly: true });

            // Store tempId in dictionary for one day (24 hours)
            tempIdStore[tempId] = {
                userID,
                expires: Date.now() + 24 * 60 * 60 * 1000
            };

            res.redirect(`/gov/dashboard?role=${encodeURIComponent(role)}`);
        } else {
            res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error' });
    } finally {
        await client.close();
    }
});
