// EmailJS configuration
// 1) Create your EmailJS account and Gmail service
// 2) Replace the placeholder values below with your real EmailJS keys
// 3) Make sure the template variables match the keys used in emailjs.send(...)
const EMAILJS_CONFIG = {
    publicKey: 'YOUR_PUBLIC_KEY',
    serviceId: 'YOUR_SERVICE_ID',
    templateId: 'YOUR_TEMPLATE_ID'
};

const hasEmailJsConfig =
    EMAILJS_CONFIG.publicKey &&
    !EMAILJS_CONFIG.publicKey.includes('YOUR_') &&
    EMAILJS_CONFIG.serviceId &&
    !EMAILJS_CONFIG.serviceId.includes('YOUR_') &&
    EMAILJS_CONFIG.templateId &&
    !EMAILJS_CONFIG.templateId.includes('YOUR_');

if (typeof emailjs !== 'undefined' && hasEmailJsConfig) {
    emailjs.init(EMAILJS_CONFIG.publicKey);
} else if (typeof emailjs !== 'undefined') {
    console.warn('EmailJS is not configured yet. Add your real public/service/template keys in register.js.');
}

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

function showMessage(message, color = '#216bd1') {
    const msg = document.getElementById('message');
    if (!msg) return;
    msg.style.color = color;
    msg.textContent = message;
}

// Step 1: Register Form Submission (Check passwords & send OTP via EmailJS)
const registerForm = document.getElementById('registerForm');
if (registerForm) {
    registerForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const username = document.getElementById('username').value.trim();
        const email = document.getElementById('reg-email').value.trim();
        const password = document.getElementById('reg-password').value;
        const confirmPassword = document.getElementById('confirm-password').value;

        if (!username || !email || !password || !confirmPassword) {
            showMessage('Please fill in all fields.', 'red');
            return;
        }

        if (!/^[^\s@]+@gmail\.com$/i.test(email)) {
            showMessage('Please enter a valid Gmail address.', 'red');
            return;
        }

        if (password !== confirmPassword) {
            showMessage('Passwords do not match!', 'red');
            return;
        }

        if (password.length < 6) {
            showMessage('Password must be at least 6 characters long.', 'red');
            return;
        }

        generatedOTP = Math.floor(100000 + Math.random() * 900000).toString();
        tempUserData = { username, email, password };

        console.log('-------------------------------------');
        console.log('YOUR GENERATED OTP CODE IS:', generatedOTP);
        console.log('-------------------------------------');

        showMessage('Sending OTP code to ' + email + '...');

        if (!hasEmailJsConfig) {
            showMessage('EmailJS is not configured yet. Please add your real EmailJS keys in register.js.', 'red');
            console.error('EmailJS configuration missing. Replace YOUR_PUBLIC_KEY, YOUR_SERVICE_ID, and YOUR_TEMPLATE_ID with real values.');
            return;
        }

        // Send real email with EmailJS API
        emailjs.send(EMAILJS_CONFIG.serviceId, EMAILJS_CONFIG.templateId, {
            to_name: username,
            to_email: email,
            otp_code: generatedOTP
        })
        .then(function () {
            showMessage('OTP code successfully sent to your Gmail!', 'green');

            // Switch UI to OTP Form
            document.getElementById('registerForm').style.display = 'none';
            document.getElementById('otpForm').style.display = 'block';
            document.getElementById('pageTitle').textContent = 'OTP Verification';
            document.getElementById('pageSubtitle').textContent = 'Please check your Gmail inbox';
        }, function (error) {
            showMessage('Failed to send email. Please check your EmailJS keys, template, or internet connection.', 'red');
            console.error('EmailJS Error details:', error);
        });
    });
}

// Step 2: OTP Verification
const otpForm = document.getElementById('otpForm');
if (otpForm) {
    otpForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const userOtp = document.getElementById('otpInput').value.trim();

        if (userOtp === generatedOTP) {
            localStorage.setItem('user_' + tempUserData.email, JSON.stringify(tempUserData));

            showMessage('Account verified & created successfully! Redirecting to login...', 'green');

            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
        } else {
            showMessage('Incorrect OTP code. Please try again.', 'red');
        }
    });
}
