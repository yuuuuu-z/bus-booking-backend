import { transporter } from "../config/mail.js";

export const sendOtpEmail = async (email, otp) => {
  await transporter.sendMail({
    from: `"BusGO" <${process.env.SMTP_EMAIL}>`,
    to: email,
    subject: "Your OTP Code",
    html: `
      <!DOCTYPE html>
      <html>
        <body style="margin: 0; padding: 0; background-color: #f4f4f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
          <table width="100%" cellpadding="0" cellspacing="0" style="padding: 40px 20px;">
            <tr>
              <td align="center">
                <table width="100%" style="max-width: 450px; background-color: #ffffff; border-radius: 12px; padding: 40px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
                  <tr>
                    <td align="center">
                      <!-- Logo/Brand -->
                      <h2 style="margin: 0 0 24px; font-size: 20px; font-weight: 700; color: #2563eb;">BusGO</h2>
                      
                      <!-- Heading -->
                      <h1 style="margin: 0 0 8px; font-size: 24px; font-weight: 600; color: #18181b;">Verify Your Email</h1>
                      
                      <!-- Message -->
                      <p style="margin: 0 0 24px; font-size: 15px; color: #52525b; line-height: 1.6;">
                        Thanks for signing up! Use the code below to complete your verification and start booking your trips.
                      </p>
                      
                      <!-- OTP Code -->
                      <div style="background-color: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 20px 32px; margin-bottom: 24px;">
                        <span style="font-size: 36px; font-weight: 700; letter-spacing: 8px; color: #1d4ed8;">${otp}</span>
                      </div>
                      
                      <!-- Expiry Notice -->
                      <p style="margin: 0 0 24px; font-size: 13px; color: #a1a1aa;">
                        ⏱️ This code expires in <strong>10 minutes</strong>
                      </p>
                      
                      <!-- Security Notice -->
                      <div style="border-top: 1px solid #e4e4e7; padding-top: 20px;">
                        <p style="margin: 0; font-size: 12px; color: #71717a; line-height: 1.5;">
                          If you didn't request this code, you can safely ignore this email. Someone may have entered your email by mistake.
                        </p>
                      </div>
                    </td>
                  </tr>
                </table>
                
                <!-- Footer -->
                <p style="margin: 24px 0 0; font-size: 12px; color: #a1a1aa;">
                  © 2026 BusGO. All rights reserved.
                </p>
              </td>
            </tr>
          </table>
        </body>
      </html>
    `,
  });
};
