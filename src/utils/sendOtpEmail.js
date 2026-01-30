import { transporter } from "../config/mail.js";

export const sendOtpEmail = async (email, otp) => {
  await transporter.sendMail({
    from: `"BusGO" <${process.env.SMTP_EMAIL}>`,
    to: email,
    subject: "Your OTP Code",
    html: `
      <h2>Email Verification</h2>
      <p>Your OTP code is:</p>
      <h1 style="letter-spacing: 3px">${otp}</h1>
      <p>This code expires in 10 minutes.</p>
    `,
  });
};
