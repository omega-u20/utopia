import express from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import * as citz from './citizen.js'
import * as gov from './gov.js'
import * as auth from './auth.js'


dotenv.config();
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {//homepage
  res.json({ status: 'Server is running' });
});

app.get('/login', (req, res) => {//display login page
  res.json({ status: 'OK' });
});

app.post('/login', (req, res) => {//handle login requests
  const { role } = req.body;

  if (role=='citz') {
    const { nic,pass } = req.body;
    if (auth.AuthCitizen(nic,pass)) {
      res.json(JSON.parse({ 'status': 'User logged in', 'uid':0x0000 }));
    } else {
      res.json(JSON.parse({ 'status': 'Login error' }));
    }
  } else if(role=='gov'){
    const{username,password,govRole}=req.body
    if (auth.AuthGov(uid,pass,role)) {
      res.json(JSON.parse({ 'status': 'User logged in', 'uid':0x00012 }));
    } else {
      res.json(JSON.parse({ 'status': 'Login error' }));
    }
  }
});

app.get('/signup', (req, res) => {//display signup page
  res.json({ status: 'OK' });
});

app.post('/signup', (req, res) => {//handle signup requests
  const { username, password } = req.body;
    res.json({ status: 'User registered', username });
});

app.post('/dashboard', (req, res) => {//null
  res.json({ status: 'Dashboard data' });
});

/** Citizen */
app.get('/dashboard/citz', (req, res) => {//display citz dashboard
  res.json({ status: 'Dashboard citz' });
});

//handle citz dash functions
app.post('/dashboard/citz/PayTax',(req,res)=>{
  const {uid,tin,amount}= req.body
  const feedback = citz.PayTax(uid,tin,amount)
  res.status(201).json(JSON.parse(feedback))
})
app.post('/dashboard/citz/PayUtil',(req,res)=>{
  const {uid,AccNo,type,amount}=req.body
  const feedback =citz.PayUtility(uid,type,AccNo,amount)
  res.status(201).json(JSON.parse(feedback))
})
app.post('/dashboard/citz/ReqEmergency',(req,res)=>{
  const {uid,loc,type}=req.body
  const feedback =citz.ReqEmergency(uid,type,loc)
  res.status(201).json(JSON.parse(feedback))
})
app.post('/dashboard/citz/SendComplaint',(req,res)=>{
  const {uid,title,discription,loc}=req.body
  const feedback =citz.SendComplaint(uid,title,discription,loc)
  res.status(201).json(JSON.parse(feedback))
})

/**Government */
app.get('/dashboard/gov', (req, res) => {//display gov dashboard
  res.json({ status: 'Dashboard data' });
});

//handle gov dash functions
app.post('/dashboard/gov/MarkDispatched',(req,res)=>{
  const {mid} =req.body
  const feedback =gov.MarkDispatched(mid)
  res.status(201).json(JSON.parse(feedback))
})
app.post('/dashboard/gov/MarkCompleted',(req,res)=>{
  const {mid} =req.body
  const feedback =gov.MarkCompleted(mid)
  res.status(201).json(JSON.parse(feedback))
})
app.post('/dashboard/gov/Refresh',(req,res)=>{
  const {mid} =req.body
  const feedback =gov.RefreshFeed()
  res.status(201).json(JSON.parse(feedback))
})



app.listen(port, () => {
  console.log(`Server running on port ${app._router} ${port}`);
});