document.getElementsByTagName('form').item(0).addEventListener('submit',(event)=>{
    event.preventDefault();
    console.log('a');
    

    async function fetchEM() {
        const  requestData= await GetEmData()
        //console.log(requestData);
        
        if (requestData) {
            //console.log('c');
            await fetch('/dashboard/citz/ReqEmergency', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(requestData)   
                }).then(response=>{
                    if (!response.ok) {
                        throw new Error('Network response is !ok')
                    }
                    return response.json()
                }).then(data=>{
                    alert('Emergency Request Submitted. Request ID: ' + data.ReqID);
                    document.querySelectorAll('input[name="emergencyType"]').forEach(input => input.checked = false);
                    console.log(data);
                }).catch (error=>{
                    console.error('Error:', error);
                    alert('Failed to submit emergency request.\nYou may call 119');
                })
        } else {
            console.log('requestData is not ready');
        }
    }

    function GetEmData() {   
        //console.log('b');
        return new Promise(res=>{
            const selectedType = document.querySelector('input[name="emergencyType"]:checked').id;
            const UID = '00000000'
           
            navigator.geolocation.getCurrentPosition((pos)=>{  
        //console.log('x');
                const UserLoc = [pos.coords.latitude,pos.coords.longitude]
                    console.log(UserLoc);
                res({uid:UID,type:selectedType,loc:UserLoc})
            },(er)=>{  
        //console.log('y');
                function ReadLoc() {
                        var UserLoc =[]
                        UserLoc = [window.prompt('Location needed','').toString()]
                        CheckLoc(UserLoc)
                }
                function CheckLoc(UserLoc) {  
        //console.log('z');
                    if (UserLoc && UserLoc.length>0 && UserLoc[0]!=""){
                        //console.log(UserLoc);
                        res({uid:UID,type:selectedType,loc:UserLoc})
                    }else{
                        ReadLoc()
                    }
                }
                ReadLoc()
            })
        },re=>{
           res({uid:UID,type:selectedType,loc:['000000']})
        }) 
    }

    fetchEM()
    
});

document.getElementsByTagName('form').item(1).addEventListener('submit',async (event)=>{
    event.preventDefault();

    const Ctitle = await document.getElementById('CTitle').value
    const Cdis = await document.getElementById('CDis').value
    const Cimg = document.getElementById('CImage').files[0];
    const Uid = '0000000000';

    const formData = new FormData();
    formData.append('uid', Uid);
    formData.append('ctitle', Ctitle);
    formData.append('cdis', Cdis);
    formData.append('cim', Cimg, new Date().getTime()+'-00.'+Cimg.name.split('.').pop());
    
    await fetch('/dashboard/citz/SendComplaint', {
        method: 'POST',
        body: formData
    }).then(res => res.json())
    .then(data => {
        console.log(data);
        alert('Complaint Submitted. Complaint ID: ' + data.CompID);
    }).catch(er => {
        console.log(er);
        alert('Failed to submit complaint. Please try again.');
    });
})
/* 
fetch('/citz/getUserInfo').then(response => {
    response.json().then(data => {
        document.getElementById('phoneDisplay').innerText = data.phone;
        document.getElementById('nameDisplay').innerText = data.name;
        document.getElementById('emailDisplay').innerText = data.email;
    }).catch(er=>{
        console.log(er);
        
    })
}).catch(error => {
        document.getElementById('phoneDisplay').innerText = document.getElementById('phoneDisplay').innerText+' +94 00 00 000000';
        document.getElementById('nameDisplay').innerText = document.getElementById('nameDisplay').innerText+' John Doe';
        document.getElementById('emailDisplay').innerText = document.getElementById('emailDisplay').innerText+' johndoe@example.com'
    console.error('Error fetching user info:', error);
}).finally(() => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const today  = new Date();
    document.getElementById('dateDisplay').innerText = today.toLocaleDateString("en-US", options);
});
 */
document.getElementById('logoutBtn').addEventListener('click', function() {
    fetch('/logout', { method: 'POST' })
    .then(response => {
        if (response.ok) {
            window.location.href = '/login';
        } else {
            alert('Logout failed.');
        }
    })});
