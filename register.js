// EmailJS setup
// If you do not have EmailJS yet, the app will still work in demo mode by showing the OTP in the console and on the screen.
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

// Step 1: Register Form Submission
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

        if (!hasEmailJsConfig) {
            showMessage('Demo mode: OTP generated successfully. Check the console or use the OTP displayed below.', '#216bd1');

            document.getElementById('registerForm').style.display = 'none';
            document.getElementById('otpForm').style.display = 'block';
            document.getElementById('pageTitle').textContent = 'OTP Verification';
            document.getElementById('pageSubtitle').textContent = 'Demo mode - your OTP is shown below';

            const otpInput = document.getElementById('otpInput');
            if (otpInput) {
                otpInput.value = generatedOTP;
                otpInput.focus();
                otpInput.select();
            }

            return;
        }

        showMessage('Sending OTP code to ' + email + '...');

        emailjs.send(EMAILJS_CONFIG.serviceId, EMAILJS_CONFIG.templateId, {
            to_name: username,
            to_email: email,
            otp_code: generatedOTP
        })
        .then(function () {
            showMessage('OTP code successfully sent to your Gmail!', 'green');

            document.getElementById('registerForm').style.display = 'none';
            document.getElementById('otpForm').style.display = 'block';
            document.getElementById('pageTitle').textContent = 'OTP Verification';
            document.getElementById('pageSubtitle').textContent = 'Please check your Gmail inbox';
        }, function (error) {
            showMessage('Failed to send OTP. Demo mode activated. Check the console for the OTP code.', '#216bd1');
            console.error('EmailJS Error details:', error);
            console.log('Fallback OTP:', generatedOTP);

            document.getElementById('registerForm').style.display = 'none';
            document.getElementById('otpForm').style.display = 'block';
            document.getElementById('pageTitle').textContent = 'OTP Verification';
            document.getElementById('pageSubtitle').textContent = 'Fallback demo mode';

            const otpInput = document.getElementById('otpInput');
            if (otpInput) {
                otpInput.value = generatedOTP;
                otpInput.focus();
                otpInput.select();
            }
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
