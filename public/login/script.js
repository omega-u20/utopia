import {toast,AttachToast} from '../toast.js'

AttachToast()

document.getElementById('loginForm').addEventListener('submit',async (ev)=>{
    ev.preventDefault()

    const role =document.getElementById('role').value;

    if (role === 'gov') {
        const username = document.getElementById('govUsername').value
        const password = document.getElementById('govPassword').value
        const govRole = document.getElementById('govRole').value
        
        if (!username || !password || !govRole) {
            toast.error('Please fill out all fields')
        }

        await fetch('/login',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ role:role,username:username,password:password,govRole:govRole })
        }).then(res=>res.json()).then((data)=>{
            console.log(data);
            if (data.success) {
                document.cookie="session=" + data.session + "; path=/;expires=Fri, 31 Dec 9999 23:59:59 GMT";
                toast.success('Login Success! Redirecting!')
                setTimeout(()=>{
                    window.location.href='/dashboard/gov/'
                },3100)
            }else{
                if(data.code==='GOV_404'){
                    toast.error(data.message)
                    setTimeout(() => {
                        window.location.href = '/help?q='+data.code;
                    }, 3100);
                }
                if(data.code==='GOV_400'){
                    toast.error(data.message)
                    setTimeout(() => {
                        window.location.href = '/help?q='+data.code;
                    }, 3100);
                }
                if(data.code==='GOV_500'){
                    toast.error(data.message+' Try Again Later!')
                }
            }
        })
    } else if(role === 'citz'){
        const nic = document.getElementById("citizenNIC").value;
        const password = document.getElementById("citizenPassword").value;

        if (!nic || !password) {
            toast.error('Please fill out all fields')
        }

        await fetch('/login',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ role:role,nic:nic,password:password })
        }).then(res=>res.json()).then((data)=>{
            console.log(data);
            if (data.success) {
                document.cookie="session=" + data.session + "; path=/;expires=Fri, 31 Dec 9999 23:59:59 GMT";
                toast.success('Login Success! Redirecting!')
                setTimeout(()=>{
                    window.location.href=`/dashboard/citz/`
                },3100)
            }else{
                if(data.code==='USER_404'){
                    toast.error(data.message)
                    setTimeout(() => {
                        window.location.href = '/help?q='+data.code;
                    }, 3100);
                }
                if(data.code==='USER_400'){
                    toast.error(data.message)
                    setTimeout(() => {
                        window.location.href = '/help?q='+data.code;
                    }, 3100);
                }
                if(data.code==='USER_500'){
                    toast.error(data.message+' Try Again Later!')
                }
            }
        })
    }
})