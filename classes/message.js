// Message Base Class
class Message{
    constructor (mid,uid,status='N'||'P'||'C'){
        this.mid = mid
        this.uid = uid
        this.status = status||'N' //N-new,P-processing,C-completed
        this.timestamp = new Date().getTime()
    }
}
// Complaint Class
class Complaint extends Message{
    constructor(title,discription,image,...args){
        super(...args)
        this.title = title
        this.discription = discription
        this.image = image
    }
}
// Emergency Request Class
class EmergencyReq extends Message{
    constructor(reqType,location,...args){
        super(...args)
        this.reqType = reqType
        this.location = location
    }
}

export {Message,Complaint,EmergencyReq}