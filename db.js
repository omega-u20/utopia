import mongoose from "mongoose";
import { MongoClient, ServerApiVersion } from "mongodb";
import dotenv from "dotenv";
dotenv.config();

const ProjectURI = process.env.PROJECT_URI;


const govSchema = new mongoose.Schema({
    empID: { type: String, required: true, unique: true },
    uid: {type:String, required: true, unique: true},
    govRole: { type: String, required: true },
    govArea: { type: String, required: true },
    authLevel: { type: Number, required: true },
    password: { type: String, required: true }
});
const Gov = mongoose.model('Gov', govSchema);

const citizenSchema = new mongoose.Schema({
    nic: { type: String, required: true, unique: true },
    uid: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    phone: { type: String, required: false },
    address: { type: String, required: false },
    password: { type: String, required: true }
});
const Citizen = mongoose.model('Citizen', citizenSchema);



/* async function CitzConnect(){
    mongoose.connect(CitzURI,
     { 
        useNewUrlParser: true, 
        useUnifiedTopology: true 
    })
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));
} */

const ProjectClient = new MongoClient(ProjectURI, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function GetCitizen(nic,password){
    await ProjectClient.connect().then(()=>{
        console.log('Connected to MongoDB');
    }).catch((err)=>{
        console.error('Error connecting to MongoDB:',err);
    });
    try {
        const citizen = await ProjectClient.db("Citizen").collection("Cluser0").findOne({ nic: nic, password: password });
        if (citizen) {
            console.log('Citizen found');
            return citizen;
        } else {
            console.log('Citizen not found');
            return false;
        }   
    } catch (error) {
        console.error("Error retrieving citizen:", error);
        return false;
    }finally{
        await ProjectClient.close().then(()=>{
            console.log('MongoDB connection closed');
        }).catch((err)=>{
            console.error('Error closing MongoDB connection:',err);
        });
    }

}

async function GetGov(empID,password,role){
    await ProjectClient.connect().then(()=>{
        console.log('Connected to MongoDB');
    }).catch((err)=>{
        console.error('Error connecting to MongoDB:',err);
    });
    try {
        const gov = await ProjectClient.db("Gov").collection("Cluser0").findOne({ empID: empID, password: password, govRole: role });
        if (gov) {
            console.log('Gov found');
            return gov;
        } else {
            console.log('Gov not found');
            return false;
        }
    } catch (error) {
        console.error("Error retrieving gov:", error);
        return false;
    }finally{
        await ProjectClient.close().then(()=>{
            console.log('MongoDB connection closed');
        }).catch((err)=>{
            console.error('Error closing MongoDB connection:',err);
        });
    }
}

async function NewCitizen(citi, password){
    const citizen = JSON.parse(citi);
    
    await ProjectClient.connect().then(()=>{
        console.log('Connected to MongoDB');
    }).catch((err)=>{
        console.error('Error connecting to MongoDB:',err);
    });
    try {
        const newCitizen = new Citizen({
            nic: citizen.nic,   
            uid: citizen.uid,
            email: citizen.email,
            phone: citizen.phone,
            address: citizen.address,   
            password: password
        });

        const result = await ProjectClient.db("Citizen").collection("Cluser0").insertOne(newCitizen);
        if (result.acknowledged) {
            console.log('Citizen inserted');
            return true;
        } else {
            console.error('Error inserting citizen');
            return false;
        }
    } catch (error) {
        console.error("Error saving citizen:", error);
        return false;
    }finally{
        await ProjectClient.close().then(()=>{
            console.log('MongoDB connection closed');
            return true;
        }).catch((err)=>{
            console.error('Error closing MongoDB connection:',err);
        });
    }
}

async function NewGov(gov, pswd){
    const govData = JSON.parse(gov);

    await ProjectClient.connect().then(()=>{
        console.log('Connected to MongoDB');
    }).catch((err)=>{
        console.error('Error connecting to MongoDB:',err);
    });
    try {
        const newGov = new Gov({
                empID: govData.empID,
                uid: govData.uid,
                govRole: govData.govRole,
                govArea: govData.govArea,
                authLevel: govData.authLevel,
                password: pswd
            });
        await ProjectClient.db("Gov").collection("Cluser0").insertOne(newGov).then((fd)=>{
            console.log('Gov inserted');
        return true;
        }).catch((err)=>{
            console.error('Error inserting gov:',err);
            return false;
        });
    }catch (error) {
        console.error("Error saving gov:", error);
        return false;
    }finally{
        await ProjectClient.close().then(()=>{
            console.log('MongoDB connection closed');
        }).catch((err)=>{
            console.error('Error closing MongoDB connection:',err);
        });
            return true;
    }
}

export {GetCitizen,GetGov,NewGov,NewCitizen};