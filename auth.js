import {GetCitizen,GetGov,NewCitizen,NewGov} from './db.js';
import {generateUserID,hashPassword} from './crypt.js';
import { email_otp } from './crypt.js';
import {Citizen,Gov} from './classes/user.js';

export async function AuthCitizen(nic, password){
    const user=await GetCitizen(nic, await hashPassword(password))
    console.log('User Grabbed ~ auth');
    
    if (user){
        return JSON.parse(user);
    }else{
        throw new AuthError("Authentication failed Citizen");
    }
}

export async function AuthGov(empID, password, role){
    console.log(empID, password, role);
    
    const user=await GetGov(empID, await hashPassword(password), role)
    console.log('User Grabbed ~ gov');

    if (user){
        return JSON.parse(user)
    }else{
        throw new AuthError("Authentication failed Gov");
    }
}


/* Register a new citizen */
export async function RegisterCitizen(nic, email, name, phone, address, password){
    if (await GetCitizen(nic)){
        throw new DuplicateUserError("User already exists")
    }else{
        const uid = await generateUserID('cit');
        const citizen = new Citizen(uid,nic, name, email, phone, address);
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
    //console.log(password);
    
    if (await GetGov(empID)){
        throw new DuplicateUserError("User already exists");
    }else{
        const uid = await generateUserID('gov');
        const gov = new Gov(uid,empID, role, area);
        try {
            if(await NewGov(JSON.stringify(gov), await hashPassword(password))){
                console.log('gov created');
                return {success:true, uid:uid};
            }else{
                throw new RegistrationError("Registration failed [DB-GOV]");
            }
        }catch (error) {
            console.log(error);
            throw new RegistrationError("Registration failed");
        }
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