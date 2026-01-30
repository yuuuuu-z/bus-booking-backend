export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// const sendOtpEmail = async (email, otp) => {
//   await transporter.sendMail({
//     from: `"Bus Booking" <${process.env.SMTP_USER}>`,
//     to: email,
//     subject: "Verify your email",
//     html: `
//         <h2>Email Verification</h2>
//         <p>Your OTP code is:</p>
//         <h1>${otp}</h1>
//         <p>This code expires in 10 minutes.</p>
//       `,
//   });
// };
