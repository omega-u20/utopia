import {GenerateMID} from './crypt.js';
import * as db from './db.js';
import {Complaint,EmergencyReq} from './classes/message.js';

// Payment Functions
function PayUtility(uid,BillType,AccNumber,Amount) {
    return {success:true}
}
function PayTax(uid,Tin,Amount) {
    return {ssuccess:true}
}

// Emergency Request Function
async function ReqEmergency(uid,ReqType,Location) {
    
    const mid = await GenerateMID('EMR')
    const Emergency = new EmergencyReq(ReqType,Location,mid,uid)
    console.log('Object: ' + JSON.stringify(Emergency));
    
    try {
        if(await db.NewEmergency(JSON.stringify(Emergency))){
            return {EmReqID:mid,status:'Success'}
        }else{
            return {status:'Failed'}
        }
    }catch (error) {
        console.log('Error sending emergency',error);
        return {status:'Failed'}
    }
    
}
// Complaint Function
async function SendComplaint(uid,Title,Discription,Image) {
    const mid = await GenerateMID('CMP')
    const Complain = new Complaint(Title,Discription,Image,mid,uid)
    try {
        if(db.NewComplaint(JSON.stringify(Complain))){
            return {CmReqID:mid,status:'Success'}
        }else{
            return {status:'Failed'}
        }
    }
    catch (error) {
        console.log('Error sending complaint',error);
        return {status:'Failed'}
    }   
}

export {PayTax,PayUtility,ReqEmergency,SendComplaint}