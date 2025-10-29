import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

dotenv.config();
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.json({ status: 'Server is running' });
});

app.get('/login', (req, res) => {
  res.json({ status: 'OK' });
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;
    // Here you would normally handle user authentication logic
    res.json({ status: 'User logged in', username });
});

app.get('/signup', (req, res) => {
  res.json({ status: 'OK' });
});

app.post('/signup', (req, res) => {
  const { username, password } = req.body;
    // Here you would normally handle user registration logic
    res.json({ status: 'User registered', username });
});

app.post('/dashboard', (req, res) => {
  res.json({ status: 'Dashboard data' });
});

app.get('/dashboard/citz', (req, res) => {
  res.json({ status: 'Dashboard citz' });
});

app.get('/dashboard/gov', (req, res) => {
  res.json({ status: 'Dashboard data' });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});