// Initialize EmailJS (I-replace ang YOUR_PUBLIC_KEY sa imong EmailJS key)
(function () {
    emailjs.init("YOUR_PUBLIC_KEY");
})();

let generatedOTP = "";
let tempUserData = {};

// Show / Hide Password toggle
const showRegPasswordBtn = document.getElementById('showRegPassword');
const regPasswordInput = document.getElementById('reg-password');

if (showRegPasswordBtn) {
    showRegPasswordBtn.addEventListener('click', function () {
        if (regPasswordInput.type === 'password') {
            regPasswordInput.type = 'text';
            showRegPasswordBtn.textContent = 'Hide';
        } else {
            regPasswordInput.type = 'password';
            showRegPasswordBtn.textContent = 'Show';
        }
    });
}

// Step 1: Send OTP to Gmail
document.getElementById('registerForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;
    const msg = document.getElementById('regMessage');

    // Generate random 6-digit OTP
    generatedOTP = Math.floor(100000 + Math.random() * 900000).toString();
    tempUserData = { email, password };

    msg.style.color = "#216bd1";
    msg.textContent = "Sending OTP to your Gmail...";

    // I-padala ang OTP pinaagi sa EmailJS API
    emailjs.send("YOUR_SERVICE_ID", "YOUR_TEMPLATE_ID", {
        to_email: email,
        otp_code: generatedOTP
    })
    .then(function () {
        msg.style.color = "green";
        msg.textContent = "OTP code sent to " + email;

        // Tagoan ang Step 1 form ug ipakita ang OTP form
        document.getElementById('registerForm').style.display = 'none';
        document.getElementById('otpForm').style.display = 'block';
    }, function (error) {
        msg.style.color = "red";
        msg.textContent = "Failed to send OTP. Please check your email.";
        console.error("EmailJS error:", error);
    });
});

// Step 2: Verify OTP ug I-save ang Account
document.getElementById('otpForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const userOtp = document.getElementById('otpInput').value;
    const msg = document.getElementById('regMessage');

    if (userOtp === generatedOTP) {
        // I-save sa browser storage (LocalStorage)
        localStorage.setItem("user_" + tempUserData.email, JSON.stringify(tempUserData));

        msg.style.color = "green";
        msg.textContent = "Account verified & created! Redirecting to login...";

        setTimeout(() => {
            window.location.href = "index.html";
        }, 1500);
    } else {
        msg.style.color = "red";
        msg.textContent = "Invalid OTP code. Please try again.";
    }
});
