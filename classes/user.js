class User {
    constructor(uid, role) {
        this.uid = uid;
        //this.role = role; // 'citizen' or 'gov'
    }
} 

class Citizen extends User {
    constructor(UID,nic, email, phone, address) {
        super(UID, 'citizen');
        this.nic = nic;
        this.email = email;
        this.phone = phone||'+94xxxxxxxxx';
        this.address = address||'null';
    }   
}

class Gov extends User {
    constructor(UID,empID, role, area, authLevel) {
        super(UID, 'gov');
        this.empID = empID;
        this.govArea = area;
        this.authLevel = authLevel||0; // e.g., 0,1
        this.govRole = role; // e.g., 'firefighter', 'police', 'healthworker', 'admin'
    }   
}

export {User,Citizen,Gov}