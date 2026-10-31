const crypto = require('crypto');
const nodemailer = require('nodemailer');

const OTP_TTL_MS = 5 * 60 * 1000; // 5 minutes
const MAX_ATTEMPTS = 5;

// email -> { otp, expiresAt, attempts }. In memory: fine for a single server instance.
const otpStore = new Map();

const generateOTP = () => crypto.randomInt(100000, 1000000).toString();

const transporter = process.env.EMAIL && process.env.EMAIL_PASS
    ? nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASS,
        },
    })
    : null;

// Creates a fresh OTP for the email and sends it. Without mail credentials (local dev) it is logged instead.
const sendOTP = async (recipientEmail) => {
    const otp = generateOTP();
    otpStore.set(recipientEmail, { otp, expiresAt: Date.now() + OTP_TTL_MS, attempts: 0 });

    if (!transporter) {
        console.log(`[dev] OTP for ${recipientEmail}: ${otp}`);
        return;
    }

    await transporter.sendMail({
        from: process.env.EMAIL,
        to: recipientEmail,
        subject: 'Your CineTick OTP',
        text: `Your OTP is ${otp}. It expires in 5 minutes.`,
    });
};

// One-time use: a correct OTP is removed; too many wrong attempts also removes it
const verifyOTP = (email, otp) => {
    const entry = otpStore.get(email);
    if (!entry) return false;

    if (Date.now() > entry.expiresAt || entry.attempts >= MAX_ATTEMPTS) {
        otpStore.delete(email);
        return false;
    }

    if (String(otp) !== entry.otp) {
        entry.attempts += 1;
        return false;
    }

    otpStore.delete(email);
    return true;
};

module.exports = { sendOTP, verifyOTP };
