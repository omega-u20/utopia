import {toast} from '../toast.js'

window.sendOtp =function (btn) {
    btn.disabled = true;
    btn.classList.add('btn-dissabled')
    const email = document.getElementById('email').value;
    if (!email) {
        alert('Please enter your email.');
        return;
    }
    fetch('/send-otp', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email:email })
    })
    .then(response => response.json()).then(data => {
        alert(data.feedback.message);
    })
    .catch(error => {
        console.error('Error:', error);
        btn.disabled = false;
        btn.classList.remove('btn-dissabled')
    })
}

window.verifyOtp =function (btn){
    btn.disabled = true;
    btn.classList.add('btn-dissabled')
    const email = document.getElementById('email').value;
    const otp = document.getElementById('otp').value;
    
    if (!email || !otp) {
        alert('Please enter both email and OTP.');
        btn.classList.remove('btn-dissabled')
        return;
    }
    fetch('/verify-otp', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email:email, otp:otp })
    })
    .then(response => response.json()).then(data => {   
        if (data.success) {
            alert(data.feedback.message);
            document.getElementById('isOtpVerified').value = "true";
        } else {
            toast.error(data.feedback.message);
            document.getElementById('isOtpVerified').value = "false";
            btn.disabled = false;
            btn.classList.remove('btn-dissabled')
        }
    })
    .catch(error => {
        console.error('Error:', error);
        btn.disabled = false;
        btn.classList.remove('btn-dissabled')
    });
}

document.getElementById('repassword').addEventListener('change', function() {
    const password = document.getElementById('password').value;
    const repassword = document.getElementById('repassword').value;
    if (password !== repassword) {
        this.setCustomValidity("Passwords do not match");
        this.reportValidity();
        this.classList.add("input-error");
    } else {
        this.setCustomValidity("");
        this.reportValidity();
        this.classList.remove("input-error");
}});

document.getElementById('otp').addEventListener('change', function() {
    const otp = document.getElementById('otp').value;
    if (otp.length !== 6 || isNaN(otp)) {
        this.setCustomValidity("OTP must be a 6-digit number");
        this.reportValidity();
        this.classList.add("input-error");
    } else {
        this.setCustomValidity("");
        this.classList.remove("input-error");
}});

document.getElementsByTagName('form')[0].addEventListener('submit',async function(event) {
    event.preventDefault();
    document.getElementById('btn-submit').setAttribute('disabled','true');
    btn.classList.add('btn-dissabled')
    let redirectUrl = '/login';
    const isOtpVerified = document.getElementById('isOtpVerified').value;
    if (isOtpVerified !== "true") {
        toast.error('Please verify your email with OTP before signing up.');
    }else{
        const password = document.getElementById('password').value;
        const email = document.getElementById('email').value;
        const nic = document.getElementById('nic').value;
        const citzRole = document.getElementById('citzRole').value;

        await fetch('/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ nic:nic, email:email, password:password, citzRole:citzRole, isOtpVerified:isOtpVerified })
        })
        .then(response => response.json()).then(data => {
            if (data.success && data.code==='SUCCESS') {
                document.cookie="uid=" + data.uid + "; path=/;expires=Fri, 31 Dec 9999 23:59:59 GMT";
                console.log(data);
                toast.success('Signup successful! Redirecting to login page...');
                setTimeout(()=>{
                    window.location.href = redirectUrl;    
                },3100)
            } else if (!data.success && data.code==='USER_EXISTS') {
                redirectUrl = redirectUrl+'?m=ExistingUser';
                toast.warn('User already exists. Redirecting to login page...');
                setTimeout(()=>{
                    window.location.href = redirectUrl;
                },3100)
            }else{
                alert('Signup failed. Please try again.');
                document.getElementById('btn-submit').setAttribute('disabled','false');
                btn.classList.remove('btn-dissabled')
            }
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById('btn-submit').setAttribute('disabled','false');
            btn.classList.remove('btn-dissabled')
        });
    }

});
