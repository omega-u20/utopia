import mongoose from "mongoose";
import { Long, MongoClient, ServerApiVersion } from "mongodb";
import dotenv from "dotenv";
import { type } from "os";
dotenv.config();

const ProjectURI = process.env.PROJECT_URI;

//-----------Schema--------------/
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
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: false },
    address: { type: String, required: false },
    password: { type: String, required: true }
});
const Citizen = mongoose.model('Citizen', citizenSchema);

const EmReqSchema = new mongoose.Schema({
    uid:{type:String,required:true},
    ReqID:{type:String,required:true,unique:true},
    ReqType:{type:String,required:true},//values {F || P || M}
    ReqStatus:{type:String,required:true},//values {New || Dispatched || Completed}
    ReqLoc:{type:String,required:true},
    ReqTime:{type:Number,required:true}
})

const EmReq = mongoose.model('EmReq',EmReqSchema)

const CompSchema = new mongoose.Schema({
    uid:{type:String,required:true},
    CmID:{type:String,required:true,unique:true},
    CmTitle:{type:String,reqired:true},
    CmDis:{type:String,required:true},
    CmStatus:{type:String,required:true},//values {New || Dispatched || Completed}
    CmImg:{type:String},
    CmTime:{type:Number,required:true}
})

const Comp = mongoose.model('Comp',CompSchema)

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

//--------------------Citizen & Gov DB Functions------------------//
async function GetCitizen(nic,password){
    await ProjectClient.connect().then(()=>{
        console.log('Connected to MongoDB');
    }).catch((err)=>{
        console.error('Error connecting to MongoDB:',err);
    });
    try {
        const citizen = await ProjectClient.db("Citizen").collection("Cluser0").findOne({ nic: nic, password: password });
        if (citizen) {
            console.log('Citizen found: ',JSON.stringify(citizen));
            return JSON.stringify(citizen);
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
            name:citizen.name,
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

//--------------------Complaint & Emergency DB Functions------------------//
async function NewComplaint(cmp){
    await ProjectClient.connect().then(()=>{
        console.log('Complaint DB connected');
    }).catch((er)=>{
        console.log('Complaint Connection Error')
    })

    try{
        const Complaint = new Comp({
            uid:cmp.uid,
            CmID:cmp.mid,
            CmTitle:cmp.title,
            CmDis:cmp.discription,
            CmImg:cmp.image,
            CmStatus:cmp.status,
            CmTime:cmp.timestamp
        })

        const ResultCom = await ProjectClient.db("Complaints").collection("Cluster0").insertOne(Complaint)
        if (ResultCom.acknowledged) {
            console.log('Complaint Inserted');
            return true
        } else {
            console.log('Error Inserting Complaint');
            return false
        }
    }catch (error){
        console.log('Error saving complaint',error);
        return false
    }finally{
        await ProjectClient.close(()=>{
            console.log('Compalint DB closed');
            return true
        }).catch((err)=>{
            console.log('Error closing Complaint DB',err)
        })
    }
}

async function NewEmergency(emr){
    await ProjectClient.connect().then(()=>{
        console.log('Emergency DB connected');
    }).catch((er)=>{
        console.log('Emergency Connection Error')
    })

    try{
        const Emergency = new EmReq({
            uid:emr.uid,
            ReqID:emr.mid,
            ReqType:emr.reqType,
            ReqStatus:emr.status,
            ReqLoc:emr.location,
            ReqTime:emr.timestamp
        })
        const ResultEmr = await ProjectClient.db("Emergency").collection("Cluster0").insertOne(Emergency)
        if (ResultEmr.acknowledged) {
            console.log('Emergency Inserted');
            return true
        } else {
            console.log('Error Inserting Emergency');
            return false
        }
    }catch (error){
        console.log('Error saving emergency',error);
        return false
    }finally{
        await ProjectClient.close(()=>{
            console.log('Emergency DB closed');
            return true
        }).catch((err)=>{
            console.log('Error closing Emergency DB',err)
        })
    }
}

async function GetEmergencies() {
    await ProjectClient.connect().then(()=>{
        console.log('Connected for Emergencies');
    }).catch((er)=>{
        console.log('Emergency Connect Error',er);
    })

    try {
        const EmergencyDB = ProjectClient.db("Emergency").collection("Cluster0").find({ReqStatus:'N'||'D'})
        if (EmergencyDB.length!=0) {
            console.log('Emergency loaded')
            return EmergencyDB
        } else  {
            console.log('Emergency DB Empty')
            return false
        }
    } catch (error) {
        console.log('Error retrieving EmReq0',error);
        return false
    }finally{
        await ProjectClient.close().then(()=>{
            console.log('Emergencies Closed');
        }).catch((err)=>{
            console.log('Emergency close error');
        })
    }
}

async function GetComplaints(){
    await ProjectClient.connect().then(()=>{
        console.log('Connected to Complaints');
    }).catch((er)=>{
        console.log('Complaints Connect Error',er);
    })

    try {
        const ComplaintsDB = ProjectClient.db("Complaints").collection("Cluster0").find({CmStatus:'N'||'D'})
        if (ComplaintsDB.length!=0) {
            console.log('Complaints loaded')
            return ComplaintsDB
        } else  {
            console.log('Complaints DB Empty')
            return false
        }
    } catch (error) {
        console.log('Error retrieving Complaints',error);
        return false
    }finally{
        await ProjectClient.close().then(()=>{
            console.log('Complaints Closed');
        }).catch((err)=>{
            console.log('Complaints close error');
        })
    }
}

async function UpdateEmergencyStatus(mid,newStat){
    await ProjectClient.connect().then(()=>{
        console.log('Connected to Emergancy');
    }).catch((er)=>{
        console.log('Emergancy Connect Error',er);
    })

    try {
        const emergency = ProjectClient.db('Emergency').collection('Cluster0').findOneAndUpdate({ReqID:mid},{ReqStatus:newStat})
        if (emergency) {
            return true
        }else{
            return false
        }
    } catch (error) {
        console.log('Error retrieving EmReq0',error);
        return false
    }finally{
        await ProjectClient.close().then(()=>{
            console.log('Emergencies Closed');
        }).catch((err)=>{
            console.log('Emergency close error');
        })
    }
}

async function UpdateComplaintStatus(mid,newStat) {
    await ProjectClient.connect().then(()=>{
        console.log('Connected to Complaints');
    }).catch((er)=>{
        console.log('Complaints Connect Error',er);
    })

    try {
        const complaint = ProjectClient.db('Complaints').collection('Cluster0').findOneAndUpdate({CmID:mid},{CmStatus:newStat})
        if (complaint) {
            return true
        }else{
            return false
        }
    } catch (error) {
        console.log('Error retrieving Complaints',error);
        return false
    }finally{
        await ProjectClient.close().then(()=>{
            console.log('Complaints Closed');
        }).catch((err)=>{
            console.log('Complaints close error');
        })
    }
}


export {GetCitizen,GetGov,NewGov,NewCitizen,NewComplaint,NewEmergency,GetEmergencies,GetComplaints,UpdateEmergencyStatus,UpdateComplaintStatus};