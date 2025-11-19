import crypto from 'crypto'
import nodemailer from 'nodemailer'
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'

dotenv.config();
export var email_otp={
    'udula.u20@gmail.com':123456
}

async function generateUserID(role) {
    return `${role}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
}

async function hashPassword(pwd) {
    console.log(crypto.createHash('md5').update(pwd.toString()).digest('hex'));
    return crypto.createHash('md5').update(pwd.toString()).digest('hex');
    
}

async function signToken(data){
    // Token valid for 1 hour
    try{
        return jwt.sign(data, process.env.JWT_SECRET,{ expiresIn: '1h' });
    }catch(err){
        console.error('Error signing token:', err);
        throw err;
    }
}

async function verifyToken(req,res,next){
    const bearerHeader=req.headers['authorization']
    if(typeof bearerHeader!=='undefined'){
        const bearer=bearerHeader.split(' ')
        const bearerToken=bearer[1]
        jwt.verify(bearerToken,'secretkey',(err,decoded)=>{
            if(err){
                res.status(401).json({success:false,message:'Token is not valid'})
            }
            req.user=decoded
        next()
        })
    } else{
        res.status(403).json({success:false,message:'Forbidden'})
    }
}

async function GenerateMID(prefix){
    const timestamp = Date.now(); // Current timestamp in milliseconds
    const randomNum = Math.floor(1000 + Math.random() * 9000); // Random 4-digit number
    return `${prefix}-${timestamp}-${randomNum}`;
}

//OTP functions
const transport = nodemailer.createTransport({
    service:'gmail',
    auth:{
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    connectionTimeout: 12000, // Increased connection timeout to 120 seconds
    socketTimeout: 12000
})

async function sendOTP(email){
    const otp = Math.floor(100000 + Math.random() * 900000);
    email_otp[email]=otp;
    const mailOptions={
        from:process.env.EMAIL_USER,
        to:email,
        subject:'Your OTP Code from UTOPIA',
        html:`Your OTP code is <b>${otp}</b>. It is valid for 1 minute.</br> <i>Do not share this code with anyone.</i><br><br> sincerely, <br><i>UTOPIA Team.</i>`//TODO:change this to 10 minutes in production
    }

    let mailStatus = await transport.sendMail(mailOptions).then((info) => {
        return info;
    }).catch((error) => {
        return error;
    });
        console.log('MAIL ID: ',mailStatus.messageId);        

    if (mailStatus.messageId) {
        console.log('Email sent:', mailStatus.response);
        clearOTP(email);
        return {success:true,message:'OTP sent successfully'}
    } else {
        console.error('Error sending email:', mailStatus);
        return {success:false, message:'Failed to send OTP'}
    }
}

function clearOTP(email){
    setTimeout(()=>{
        delete email_otp[email]
        console.log(`email OTP cleared ${email}`);
    },1*60*1000)}//TODO:change this to 10 minutes in production

export {generateUserID, hashPassword, sendOTP,signToken,verifyToken,GenerateMID};