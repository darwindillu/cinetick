// const nodemailer = require('nodemailer');

// const generateOTP = () => {
//     return Math.floor(1000 + Math.random() * 9000);
// };

// const sendOTP = async (recipientEmail) => {
//     const otp = generateOTP(); 

//     const transporter = nodemailer.createTransport({
//         service: 'gmail', 
//         auth: {
//             user: process.env.EMAIL, 
//             pass: process.env.EMAIL_PASS, 
//         },
//     });

//     const mailOptions = {
//         from: process.env.EMAIL, 
//         to: recipientEmail, 
//         subject: 'Your OTP Code', 
//         text: `Your OTP is: ${otp}`, 
//     };

//     try {
//         await transporter.sendMail(mailOptions);
//         return otp; 
//     } catch (error) {
//         console.error('Error sending email:', error);
//     }
// };

// module.exports = { sendOTP };
