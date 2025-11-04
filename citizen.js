function PayUtility(uid,BillType,AccNumber,Amount) {
    return {'status':'Success'}
}
function PayTax(uid,Tin,Amount) {
    return {'status':'Success'}
}
function ReqEmergency(uid,ReqType,Location) {
    const rid = 'EM-'+new Date().getTime().toString()
    return {'rid':rid,'status':'Success'}
}
function SendComplaint(uid,Title,Discription,Location,Image) {
    const cid = 'CM-'+new Date().getTime().toString()
    return {'cid':cid,'status':'Success'}
}

module.exports={PayTax,PayUtility,ReqEmergency,SendComplaint}