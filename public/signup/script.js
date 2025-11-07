function sendOtp() {
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
    });
}

function verifyOtp(){
    const email = document.getElementById('email').value;
    const otp = document.getElementById('otp').value;
    
    if (!email || !otp) {
        alert('Please enter both email and OTP.');
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
        } else {
            alert('Try Again');
        }
    })
    .catch(error => {
        console.error('Error:', error);
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