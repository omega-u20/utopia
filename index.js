import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import * as citz from './citizen.js'
import * as gov from './gov.js'
import * as auth from './auth.js'
import {sendOTP, signToken, verifyToken} from './crypt.js'
import { upload } from './FileHandle.js';
/* {import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';
import { fileURLToPath } from 'url';
import { dirname } from 'path';} */
import * as dtg from './data/gov.js'
import * as dtc from './data/cit.js'


dotenv.config();
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));


const port = process.env.PORT || 3000; 


/* const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename); */

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
  res.json({ status: 'ok' });
});

app.post('/logout', (req, res) => {//handle logout
  res.json({ success: true, message: 'Logged out successfully' });
});

app.post('/login', async (req, res) => {//handle login requests
  console.log('Request: '+JSON.stringify(req.body));
  const { role } = req.body;
  console.log(role);
  

  if (role=='citz') {
    const { nic,password } = req.body;
    try{
      const user=await auth.AuthCitizen(nic, password)
      console.log('USER from index: ',user);
    
      if (user) {
        const token = await signToken({'uid':user.uid,'nic':user.nic})
        console.log('signed: '+token);
        
        dtc.user[user.uid]={
              nic:user.nic,
              email:user.email,
              phone:user.phone,
              address:user.address
            }
            console.log(dtc.user);
            
        res.json(
          { 
            success: true,
            code:'USER_200',
            session:token
          }
        );
      } else {
        res.json({ success: false, code:'USER_500', message: 'Login error'});
      }
    }catch (e){
      if (e instanceof auth.AuthError) {
        res.json(
            {success: false,
            code:'USER_404',
           message: 'User does not exist!'})
      }else{
        res.json(
            {success: false,
            code:'USER_500',
           message: 'Unknown Error!'})
      }
    }
  } else if(role=='gov'){
    const{username,password,govRole}=req.body
    console.log({username, password, govRole});
    
    try {
      const G_user=await auth.AuthGov(username,password,govRole)
      console.log('G_user: '+G_user);
      
      if (G_user) {
        const token = await signToken({'uid':G_user.uid,'empID':G_user.empID,'gov':true})
        dtg.user[G_user.uid]={
              empID:G_user.empID,
              govRole:G_user.govRole,
              govArea:G_user.govArea
        }
        res.status(201).json(
          {
            success:true, 
            code:'GOV_200',
            session:token
          }
        );
      } else {
        res.json({ success: false,  code:'GOV_500', message: 'Login error' });
      }
    } catch (e) {
      if (e instanceof auth.AuthError) {
        res.json(
            {success: false,
            code:'GOV_404',
           message: 'User does not exist!'})
      } else {
        console.log(e);
        
        res.json(
            {success: false,
            code:'GOV_400',
           message: 'Unknown Error!'})
      }
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
  const { name, nic, email, password, citzRole, isOtpVerified } = req.body;
  if (isOtpVerified) {
    auth.RegisterCitizen(nic, email, name, null, null, password).then(feedback => {
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

app.post('/dashboard',verifyToken, (req, res) => {//get user info for dashboard
  console.log(req.body.result);
  
  if (req.body.result) {
    console.log(req.body.result.uid);
    if (req.body.result.uid.startsWith('cit')) {try{
          const us = dtc.user[req.body.result.uid]
          
          res.json({ success:true ,  feedback:{
            nic:us.nic,
            email:us.email,
            name:us.name,
            phone:us.phone,
            address:us.address
          }});          

        }catch (e){
          res.status(500).json({success:false , message:'Error Fetching Data!!'})
        }
    }else if(req.body.result.uid.startsWith('gov')){
        const us = dtg.user[req.body.result.uid]
          
        try{
          res.json({ success:true ,  feedback:{
            empID:us.empID
          }});          

        }catch (e){
          res.status(500).json({success:false , message:'Error Fetching Data!!'})
        }
      }
    } else {
          res.status(500).json({success:false , message:'Error Fetching Data!!'})
    }

});

/** Citizen */
app.get('/dashboard/citz/', (req, res) => {//display citz dashboard  
  console.log('REQ: '+req.cookies.session);

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
  if (req.user && req.user.gov) {
    try{
      const us = dtg.user[req.user]
      res.status(200).json(us)
    }catch (e){
      const us = {message:'Error Fetching Data!!'}
      res.status(500).json(us)
    }
    res.status(304).json({ success:true ,  feedback:us});
  } else {
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

app.post('/dashboard/gov/Refresh', verifyToken, async (req, res) => { 
  try {
    const feedback = await gov.RefreshFeed(); 
    res.status(201).json(feedback);
  } catch (error) {
    console.error(error); 
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

//--util---//
app.get('/map',(req,res)=>{
  res.status(200)
})

//----Admin Section------//
app.get('/su',(req,res)=>{
  res.status(200)
})

app.post('/su',(req,res)=>{
  const {access,pass}=req.body;
  if((access===process.env.ADMIN)&&(pass===process.env.ADPASS)){
    res.redirect('/su/admin')
  }
})

app.get('/su/admin',(req,res)=>{
  res.status(200)
})

app.post('/su/admin',(req,res)=>{
  const {empID, password, role, area} = req.body;
  //console.log(empID, password, role, area);
  
  const feedback = auth.RegisterGov(empID, password, role, area)
  res.status(201).json(feedback)
})

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});