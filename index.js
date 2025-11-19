import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import * as citz from './citizen.js'
import * as gov from './gov.js'
import * as auth from './auth.js'
import {sendOTP, signToken, verifyToken} from './crypt.js'
import { upload } from './FileHandle.js';
import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';
import { fileURLToPath } from 'url';
import { dirname } from 'path';


dotenv.config();
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
const port = process.env.PORT || 3000; 


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/* //-------------------- HTTPS Setup ------------------//
// Load TLS/SSL certificates
const sslOptions = {
    key: fs.readFileSync(path.join(__dirname, 'server.key')),
    cert: fs.readFileSync(path.join(__dirname, 'server.cert'))
};

// Create HTTPS server
const httpsServer = https.createServer(sslOptions, app);

// Start server on port 443 (default HTTPS port)
httpsServer.listen(443, () => {
    console.log('HTTPS Server running on port 443');
});

const httpApp = express();

httpApp.get('*', (req, res) => {
    // Redirect to HTTPS
    res.redirect('https://' + req.headers.host + req.url);
});

http.createServer(httpApp).listen(80, () => {
    console.log('HTTP Server redirecting to HTTPS on port 80');
}); */

//-------------------- Express routes ------------------//

app.get('/', (req, res) => {//homepage
  res.json({ status: 'Server is running' });
});

app.get('/login', (req, res) => {//display login page
  res.json({ status: 'OK' });
});

app.post('/login', async (req, res) => {//handle login requests
  const { role } = req.body;

  if (role=='citz') {
    const { nic,password } = req.body;
    console.log(req.body);
    
    const user=await auth.AuthCitizen(nic, password)
    if (user) {
      const token = await signToken(JSON.parse({'uid':user.uid,'nic':user.nic}))
      res.json(JSON.parse({ 'success': true, 'user':{
        'uid':user.uid,
        'nic':user.nic,
        'email':user.email,
        'phone':user.phone,
        'address':user.address
      },
      session:token
    }));
    } else {
      res.json(JSON.parse({ 'success': false, 'message': 'Login error'}));
    }
  } else if(role=='gov'){
    const{username,password,govRole}=req.body
    const G_user=await auth.AuthGov(username,password,govRole)
    if (G_user) {
      const token = await signToken(JSON.parse({'uid':G_user.uid,'empID':G_user.empID}))
      res.status(201).json(JSON.parse({ 'success':true, 'user':{
        'uid':G_user.uid,
        'empID':G_user.empID,
        'govRole':G_user.govRole,
        'govArea':G_user.govArea
      },
      session:token
    }));
    } else {
      res.status(500).json(JSON.parse({ 'success': false, 'message': 'Login error' }));
    }
  }
});

app.get('/signup', (req, res) => {//display signup page
  res.json({ status: 'OK' });
});

app.post('/send-otp', async(req, res) => {//handle otp requests
  const { email } = req.body;
  const feedback = await sendOTP(email)
  if (feedback.success) {
    console.log(`OTP sent to ${email}`)
    res.status(201).json({ feedback })
  }else{
    console.error(`Failed to send OTP to ${email}`)
    res.status(500).json({ feedback })
  }
});

app.post('/verify-otp', async(req, res) => {//handle otp verification
  const { email, otp } = req.body;
  const isValid = await auth.ValidateOtp(email, otp);
  if (isValid) {
    res.status(201).json({ success: true, feedback: { message: 'OTP verified successfully' } });
  } else {
    res.status(400).json({ success: false, feedback: { message: 'Invalid OTP' } });
  }
});

app.post('/signup', (req, res) => {//handle signup requests
  const { nic, email, password, citzRole, isOtpVerified } = req.body;
  if (isOtpVerified) {
    auth.RegisterCitizen(nic, email, null, null, password).then(feedback => {
      if (feedback.success) {
        feedback.message = 'Registration successful';
        feedback.code = 'SUCCESS';
        res.status(201).json(feedback);
      } else {
        feedback.message = 'Registration failed';
        feedback.code = 'DB_ERROR';
        res.status(500).json(feedback);
      }
    }).catch(error => {
      if (error instanceof auth.DuplicateUserError) {
        res.status(300).json({ success: false, message: 'Redirect: User already exists', code: 'USER_EXISTS' });
      } else {
        res.status(500).json({ success: false, message: 'Internal server error', code: 'SERVER_ERROR' });
      }
    });
  } else {
    res.status(400).json({ success: false, message: 'OTP not verified', code: 'OTP_ERROR' });
  }
});
/* app.get('/default-signup', async(req, res) => {//display default signup page <<--this is a test
  const feedback = await auth.RegisterCitizen('199012345678','abc@cdv.cdf',null,null,'password123')
  res.status(201).json({ feedback });
}); */

app.post('/dashboard:id', (req, res) => {//get user info for dashboard
  const { id } = req.params;
  const db = id.split('-')[0];
  if (db === 'cit') {
    citz.GetCitizenByUID(id).then(user => {
      if (user) {
        res.status(201).json({ success: true, user: JSON.parse(user) });
      } else {
        res.status(404).json({ success: false, message: 'User not found' }).redirect('/help:user-not-found');
      }
    });
  } else if (db === 'gov') {
    gov.GetGovByUID(id).then(user => {
      if (user) {
        res.status(201).json({ success: true, user: JSON.parse(user) });
      } else {
        res.status(404).json({ success: false, message: 'User not found' }).redirect('/help:user-not-found');
      }
    });
  } else {
    res.status(400).json({ success: false, message: 'Invalid user type' });
  }
});

/** Citizen */
app.get('/dashboard/citz', verifyToken, (req, res) => {//display citz dashboard
  if (req.user) {
    res.json({ status: 'Dashboard data', uid: req.user });
  } else {
    // --- Fixed redirect logic ---
    res.status(401).redirect('/login');
  }
});

//handle citz dash functions
app.post('/dashboard/citz/PayTax',(req,res)=>{
  const {uid,tin,amount}= req.body
  const feedback = citz.PayTax(uid,tin,amount)
  res.status(201).json(feedback)
})
app.post('/dashboard/citz/PayUtil',(req,res)=>{
  const {uid,AccNo,type,amount}=req.body
  const feedback =citz.PayUtility(uid,type,AccNo,amount)
  res.status(201).json(feedback)
})
app.post('/dashboard/citz/ReqEmergency',(req,res)=>{
  console.log(req.body);  
  const {uid,loc,type}=req.body
  const feedback =citz.ReqEmergency(uid,type,loc)
  res.status(201).json(feedback)
})
app.post('/dashboard/citz/SendComplaint', upload.single('cim'), (req, res) => {
  if(!req.file){
      return res.status(400).json({error:'No file uploaded'})
  }
  const img='./complaints/'+req.file.filename
  try {  
    const {uid,ctitle,cdis}=req.body
    console.log(req.body);
    
    const feedback = citz.SendComplaint(uid, ctitle, cdis, img);
    res.status(201).json(feedback);
  } catch (error) {
    console.error('Error handling complaint:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**Government */
app.get('/dashboard/gov',verifyToken, (req, res) => {//display gov dashboard
  if (req.user) {
    res.json({ status: 'Dashboard data', uid: req.user });
  } else {
    // --- Fixed redirect logic ---
    res.status(401).redirect('/login');
  }
});

// --- Fixed Gov Routes (async/await/try-catch) ---
app.post('/dashboard/gov/MarkDispatched', async (req, res) => { 
  try {
    const { mid } = req.body;
    const feedback = await gov.MarkDispatched(mid); 
    res.status(201).json(JSON.parse(feedback));
  } catch (error) {
    console.error(error); 
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.post('/dashboard/gov/MarkCompleted', async (req, res) => { 
  try {
    const { mid } = req.body;
    const feedback = await gov.MarkCompleted(mid); 
    res.status(201).json(JSON.parse(feedback));
  } catch (error) {
    console.error(error); 
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.post('/dashboard/gov/Refresh', async (req, res) => { 
  try {
    const { mid } = req.body;
    const feedback = await gov.RefreshFeed(); 
    res.status(201).json(JSON.parse(feedback));
  } catch (error) {
    console.error(error); 
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});