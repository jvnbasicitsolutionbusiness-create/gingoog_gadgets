// 1. Initialize EmailJS (Ilisi ang 'YOUR_PUBLIC_KEY' gikan sa EmailJS Dashboard)
(function () {
    emailjs.init("YOUR_PUBLIC_KEY");
})();

let generatedOTP = "";
let tempUserData = {};

// Show/Hide Password functionality (apil ang Confirm Password)
const showBtn = document.getElementById('showRegPassword');
const passInput = document.getElementById('reg-password');
const confirmPassInput = document.getElementById('confirm-password');

if (showBtn) {
    showBtn.addEventListener('click', function () {
        if (passInput.type === 'password') {
            passInput.type = 'text';
            confirmPassInput.type = 'text';
            showBtn.textContent = 'Hide';
        } else {
            passInput.type = 'password';
            confirmPassInput.type = 'password';
            showBtn.textContent = 'Show';
        }
    });
}

// Step 1: Register Form Submission (Check passwords & send OTP via EmailJS)
document.getElementById('registerForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;
    const msg = document.getElementById('message');

    // Password Match Validation
    if (password !== confirmPassword) {
        msg.style.color = "red";
        msg.textContent = "Passwords do not match!";
        return;
    }

    // Generate 6-digit OTP Code
    generatedOTP = Math.floor(100000 + Math.random() * 900000).toString();
    tempUserData = { username, email, password };

    // Print OTP sa Browser Console (F12) para sa madaling testing
    console.log("-------------------------------------");
    console.log("YOUR GENERATED OTP CODE IS:", generatedOTP);
    console.log("-------------------------------------");

    msg.style.color = "#216bd1";
    msg.textContent = "Sending OTP code to " + email + "...";

    // Pag-send og tinuod nga email gamit ang EmailJS API
    emailjs.send("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", {
        to_name: username,
        to_email: email,
        otp_code: generatedOTP
    })
    .then(function () {
        msg.style.color = "green";
        msg.textContent = "OTP code successfully sent to your Gmail!";

        // Switch UI to OTP Form
        document.getElementById('registerForm').style.display = 'none';
        document.getElementById('otpForm').style.display = 'block';
        document.getElementById('pageTitle').textContent = "OTP Verification";
        document.getElementById('pageSubtitle').textContent = "Please check your Gmail inbox";
    }, function (error) {
        msg.style.color = "red";
        msg.textContent = "Failed to send email. Please check your EmailJS Keys or internet connection.";
        console.error("EmailJS Error details:", error);
    });
});

// Step 2: OTP Verification
document.getElementById('otpForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const userOtp = document.getElementById('otpInput').value;
    const msg = document.getElementById('message');

    if (userOtp === generatedOTP) {
        // Save user account in browser storage
        localStorage.setItem('user_' + tempUserData.email, JSON.stringify(tempUserData));

        msg.style.color = "green";
        msg.textContent = "Account verified & created successfully! Redirecting to login...";

        setTimeout(() => {
            window.location.href = "index.html";
        }, 1500);
    } else {
        msg.style.color = "red";
        msg.textContent = "Incorrect OTP code. Please try again.";
    }
});
