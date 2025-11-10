import {GetCitizen,GetGov,NewCitizen,NewGov} from './db.js';
import {generateUserID,hashPassword} from './crypt.js';
import { email_otp } from './crypt.js';

class User {
    constructor(uid, role) {
        this.uid = uid;
        //this.role = role; // 'citizen' or 'gov'
    }
} 

class Citizen extends User {
    constructor(UID,nic, email, phone, address) {
        super(UID, 'citizen');
        this.nic = nic;
        this.email = email;
        this.phone = phone||'';
        this.address = address||'';
    }   
}

class Gov extends User {
    constructor(UID,empID, role, area, authLevel) {
        super(UID, 'gov');
        this.empID = empID;
        this.govArea = area;
        this.authLevel = authLevel||0; // e.g., 0,1
        this.govRole = role; // e.g., 'firefighter', 'police', 'healthworker', 'admin'
    }   
}

export async function AuthCitizen(nic, password){
    const user=await GetCitizen(nic, await hashPassword(password))
    if (user){
        return user;
    }else{
        throw new AuthError("Authentication failed Citizen");
    }
}

export async function AuthGov(empID, password, role){
    const user=await GetGov(empID, await hashPassword(password), role)
    if (user){
        return user
    }else{
        throw new AuthError("Authentication failed Gov");
    }
}


/* Register a new citizen */
export async function RegisterCitizen(nic, email, phone, address, password){
    if (await GetCitizen(nic)){
        throw new DuplicateUserError("User already exists")
    }else{
        const uid = await generateUserID('cit');
        const citizen = new Citizen(uid,nic, email, 'Enter your phone number', 'Enter your address')
        try {
            if(await NewCitizen(JSON.stringify(citizen), await hashPassword(password))){
                console.log('citizen created');
                return {success:true, uid:uid};
            }else{
                throw new RegistrationError("Registration failed [DB-CIT]");
            }
        }catch (error) {
            console.log(error);
            throw new RegistrationError("Registration failed");
        }
    }
}

/* Register a new government user */
export async function RegisterGov(empID, password, role, area){

    /* if (await GetGov(empID)){
        throw new RegistrationError("User already exists");
    } */
    const uid = await generateUserID('gov');
    var gov = new Gov(uid,empID, role, area, 0);
    try {
        if(await NewGov(JSON.stringify(gov), await hashPassword(password))){
            return true;
        }else{
            throw new RegistrationError("Registration failed [DB-GOV]");
        }
    }catch (error) {
        console.log(error);
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


/** Custom Error Classes */
class RegistrationError extends Error {
    constructor(message) {
        super(message);
        this.name = "RegistrationError";
    }  
}

class DuplicateUserError extends Error {
    constructor(message) {
        super(message);
        this.name = "DuplicateUserError";
    }
}

class AuthError extends Error {
    constructor(message) {
        super(message);
        this.name = "AuthError";
    }
}

export {AuthError,DuplicateUserError,RegistrationError}