import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import * as db from './db.js';
import * as mail from './mailing.js';
import { set } from 'mongoose';

dotenv.config();

const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Auth route
app.post('/auth', async (req, res) => {
  const { role } = req.body;
  if (role === 'gov') {
    const { username, password, govRole } = req.body;
    //const isValid = await db.login(username, password);
    setTimeout(() => {
      const isValid = true;
      
    if (isValid) {
      res.redirect('/gov/dashboard');
    } else {
      res.status(401).send('Invalid credentials');
    }},2000)

  } else if (role === 'citz') {
    const { email, password } = req.body;
    //const isValid = await db.login(email, password);
    setTimeout(() => {
      const isValid = true;
    if (isValid) {
      res.redirect('/citz/dashboard');
    } else {
    res.status(400).send('Invalid role');
  }},2000)
}
});

app.post('/logout', (req, res) => {
  // Implement logout logic (e.g., destroy session or token)
  res.status(200).send('Logged out successfully');
});

app.get('/gov/dashboard', async (req, res) => {
  // You need to get username from somewhere (session, token, etc.)
  // Example: const { employeeID, Name } = await db.getGovInfo(username);
  res.send('Gov dashboard');
});

app.get('/citz/dashboard', (req, res) => {
  res.send('Citizen dashboard');
});

app.post('/citz/signup', async (req, res) => {
  const { nic, email, password } = req.body;
  //const isSuccess = await db.citzSignup(nic, email, password);
  const isSuccess = true;
  if (isSuccess) {
    res.redirect('/login');
  } else {
    res.status(500).send('Signup failed');
  }})

app.post('/getOtp', async (req, res) => {
  const { email } = req.body;
  const status = await mail.sendOTP(email);
  if (!status) {
    return res.status(500).send('Error sending OTP');
  } else {
    res.send('OTP sent to ' + email);
  }
});

app.get('/getUserInfo', async (req, res) => {
  const { email } = req.body;
  //const userInfo = await db.getCitzInfo(email);
  setTimeout(() => {
     res.status(200).json(userInfo);
  }, 2000);
});

app.post('/VerfyOtp', (req, res) => {
  const { email, otp } = req.body;
  res.status(200).json({ verified: true, message: 'OTP verified' });
});

app.get('/citz/taxPayment', (req, res) => {
  const { tin, amount } = req.params;
  console.log(tin, amount);
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
      <meta http-equiv="refresh" content="5;url=/citz/dashboard" />
      <title>Redirecting...</title>
      </head>
      <body>
      <h1>Payment Successfull...</h1>
      <h3>You will be redirected in 5 seconds...</h3>
      </body>
    </html>
  `);
});

app.get('/citz/billPayment', (req, res) => {
  const { BillType, accounNo, amount } = req.params;
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
      <meta http-equiv="refresh" content="5;url=/citz/dashboard" />
      <title>Redirecting...</title>
      </head>
      <body>
      <h1>Payment Successfull...</h1>
      <h3>You will be redirected in 5 seconds...</h3>
      </body>
    </html>
  `);
});

app.get('/citz/cityComp', (req, res) => {
  const { address, complaint } = req.params;
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
      <meta http-equiv="refresh" content="5;url=/citz/dashboard" />
      <title>Redirecting...</title>
      </head>
      <body>
      <h1>Successfully recorded...</h1>
      <h3>You will be redirected in 5 seconds...</h3>
      </body>
    </html>
  `);
});

app.post('/citz/signup', async (req, res) => {
  const { nic, fullName, email, password, address, phone } = req.body;
  //const isSuccess = await db.citzSignup(nic, fullName, email, password, address, phone);
  const isSuccess = true;
  if (isSuccess) {
    res.redirect('/citz/login');
  } else {
    res.status(500).send('Signup failed');
  }
});

app.get('/', (req, res) => {
  res.send('Welcome to Utopia API');
});

app.post('/login', (req, res) => {
  res.sendStatus(200);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});