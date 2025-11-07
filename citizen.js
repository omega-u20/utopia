function PayUtility(uid,BillType,AccNumber,Amount) {
    return {status:'Success'}
}
function PayTax(uid,Tin,Amount) {
    return {status:'Success'}
}
function ReqEmergency(uid,ReqType,Location) {
    const rid = 'EM-'+new Date().getTime().toString()
    return {ReqID:rid,status:'Success'}
}
function SendComplaint(uid,Title,Discription,Image) {
    const cid = 'CM-'+new Date().getTime().toString()
    return {CompID:cid,status:'Success'}
}

export {PayTax,PayUtility,ReqEmergency,SendComplaint}