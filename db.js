import mongoose from "mongoose";
import { MongoClient, ServerApiVersion } from "mongodb";
import dotenv from "dotenv";
dotenv.config();

const CitzURI = process.env.CITZ_URI;


const govSchema = new mongoose.Schema({
    empID: { type: String, required: true, unique: true },
    govRole: { type: String, required: true },
    govArea: { type: String, required: true },
    authLevel: { type: Number, required: true },
    password: { type: String, required: true }
});
const Gov = mongoose.model('Gov', govSchema);

const citizenSchema = new mongoose.Schema({
    nic: { type: String, required: true, unique: true },
    cid: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    password: { type: String, required: true }
});
const Citizen = mongoose.model('Citizen', citizenSchema);



async function CitzConnect(){
    mongoose.connect(CitzURI,
     { 
        useNewUrlParser: true, 
        useUnifiedTopology: true 
    })
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));
}

const CitzClient = new MongoClient(CitzURI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

function GetCitizen(){

}

function GetGov(){

}

export async function NewCitizen(citizen, password){
    console.log('DB');
    console.log(citizen);
    console.log(password);
    
    
    
    await CitzClient.connect().then(()=>{
        console.log('Connected to MongoDB');
    }).catch((err)=>{
        console.error('Error connecting to MongoDB:',err);
    });
    try {
        const newCitizen = new Citizen({
            nic: citizen.nic,   
            cid: citizen.uid.Promise,
            email: citizen.email,
            phone: citizen.phone,
            address: citizen.address,   
            password: password
        });
        await newCitizen.save().then(()=>{
            console.log('Citizen saved');
        }).catch((err)=>{
            console.error('Error saving citizen 1:',err);
        });
        return true;
    } catch (error) {
        console.error("Error saving citizen:", error);
        return false;
    }finally{
        await CitzClient.close();
    }
}

async function NewGov(gov, pswd){
    await connect();
    try {
        const newGov = new GovModel({
                empID: gov.empID,
                govRole: gov.govRole,
                govArea: gov.govArea,
                authLevel: gov.authLevel,
                password: pswd
            });
        await newGov.save();
        return true;
    }catch (error) {
        console.error("Error saving gov:", error);
        return false;
    }
}

export {GetCitizen,GetGov,NewGov};