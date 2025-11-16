import {GenerateMID} from './crypt.js';
import * as db from './db.js';
class Message{
    constructor (mid,uid,status='N'||'P'||'C'){
        this.mid = mid
        this.uid = uid
        this.status = status||'N' //N-new,P-processing,C-completed
        this.timestamp = new Date().getTime()
    }
}

class Complaint extends Message{
    constructor(title,discription,image,...args){
        super(...args)
        this.title = title
        this.discription = discription
        this.image = image
    }
}

class EmergencyReq extends Message{
    constructor(reqType,location,...args){
        super(...args)
        this.reqType = reqType
        this.location = location
    }
}


function PayUtility(uid,BillType,AccNumber,Amount) {
    return {status:'Success'}
}
function PayTax(uid,Tin,Amount) {
    return {status:'Success'}
}
async function ReqEmergency(uid,ReqType,Location) {
    const mid = await GenerateMID('EMR')
    const Emergency = new EmergencyReq(ReqType,Location,mid,uid)
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
function SendComplaint(uid,Title,Discription,Image) {
    const mid = GenerateMID('CMP')
    const Complaint = new Complaint(Title,Discription,Image,mid,uid)
    try {
        if(db.NewComplaint(JSON.stringify(Complaint))){
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