import {GetCitizen,GetGov,NewCitizen,NewGov} from './db.js';
import {generateUserID,hashPassword} from './crypt.js';
import { email_otp } from './crypt.js';

class User {
    constructor(uid, role) {
        this.uid = uid;
        this.role = role; // 'citizen' or 'gov'
    }
} 

class Citizen extends User {
    constructor(nic, email, phone, address) {
        super(generateUserID('cit'), 'citizen');
        this.nic = nic;
        this.email = email;
        this.phone = phone;
        this.address = address;
    }   
}

class Gov extends User {
    constructor(empID, role, area, authLevel) {
        super(generateUserID('gov'), 'gov');
        this.empID = empID;
        this.govArea = area;
        this.authLevel = authLevel; // e.g., 0,1
        this.govRole = role; // e.g., 'firefighter', 'police', 'healthworker', 'admin'
    }   
}

export async function AuthCitizen(nic, password){
    if (await GetCitizen(nic, await hashPassword(password))){
        return true;
    }else{
        throw new AuthError("Authentication failed");
    }
}

export async function AuthGov(userID, password, role){
    if (await GetGov(userID, await hashPassword(password), role)){
        return true;
    }else{
        return false;
    }
}

export async function RegisterCitizen(nic, email, phone, address, password){
    /* if (await GetCitizen(nic)){
        throw new RegistrationError("User already exists");
    } */
   console.log('auth');
   
    const citizen = new Citizen(nic, email, 'Enter your phone number', 'Enter your address')
    try {
        
        if(await NewCitizen(JSON.parse(citizen), await hashPassword(password))){
            console.log('citizen created');
            
            return true;
        }else{
            throw new RegistrationError("Registration failed [DB]");
        }
    }catch (error) {
        console.log(error);
        
        throw new RegistrationError("Registration failed");
    }
}

export async function RegisterGov(empID, password, role, area){

    if (await GetGov(empID)){
        throw new RegistrationError("User already exists");
    }
    var gov = new Gov(empID, role, area, 0);
    try {
        if(newGov(gov, await hashPassword(password))){
            return true;
        }else{
            throw new RegistrationError("Registration failed [DB]");
        }
    }catch (error) {
        throw new RegistrationError("Registration failed");
    }
}

export async function ValidateOtp(email, otp){
    if (email_otp[email] && email_otp[email] == otp) {
        delete email_otp[email];
        return true;
    } else {
        return false;
    }
}

class RegistrationError extends Error {
    constructor(message) {
        super(message);
        this.name = "RegistrationError";
    }  
}

class AuthError extends Error {
    constructor(message) {
        super(message);
        this.name = "AuthError";
    }
}
