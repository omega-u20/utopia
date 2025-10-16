import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

const mongoURI = process.env.MONGO_URI;

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
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    password: { type: String, required: true }
});
const Citizen = mongoose.model('Citizen', citizenSchema);



async function connect(){
    mongoose.connect(mongoURI,
     { 
        useNewUrlParser: true, 
        useUnifiedTopology: true 
    })
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));
}

function GetCitizen(){

}

function GetGov(){

}

async function NewCitizen(citizen, password){
    await connect();
    try {
        const newCitizen = new Citizen(citizen);
        await newCitizen.save();
        return true;
    }catch (error) {
        console.error("Error saving citizen:", error);
        return false;
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

export {GetCitizen,GetGov,NewCitizen,NewGov};