// Message Base Class
class Message{
    constructor (mid,uid,status){
        this.mid = mid
        this.uid = uid
        this.status = status||'N' //N-new,P-processing,C-completed
        this.timestamp = new Date().getTime()
    }
}
// Complaint Class
class Complaint extends Message{
    constructor(title,discription,image,mid,uid,status){
        super(mid,uid,status)
        this.title = title
        this.discription = discription
        this.image = image
    }
}
// Emergency Request Class
class EmergencyReq extends Message{
    constructor(reqType,location,mid,uid,status){
        super(mid,uid,status)
        this.reqType = reqType
        this.location = location
    }
}

export {Message,Complaint,EmergencyReq}