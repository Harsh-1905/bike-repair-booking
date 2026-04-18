import nodemailer from "nodemailer";

console.log("EMAIL HOST:", process.env.EMAIL_HOST);
console.log("EMAIL USER:", process.env.EMAIL_USER ? "LOADED" : "MISSING");

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
    tls: {
        rejectUnauthorized: false
    }
});

transporter.verify((error) => {
    if (error) {
        console.error("❌ Gmail SMTP error:", error);
    } else {
        console.log("✅ Gmail SMTP ready");
    }
});

export const sendEmail = async (to, text) => {
    try {
        const info = await transporter.sendMail({
            from: `"BikeCare Support" <${process.env.EMAIL_USER}>`,
            to,
            subject: "BikeCare - Password Reset OTP",
            text,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <div style="text-align: center; margin-bottom: 30px;">
                        <h1 style="color: #E43636; margin: 0;">BikeCare</h1>
                        <p style="color: #666; margin: 5px 0;">Professional Bike Care Services</p>
                    </div>
                    
                    <div style="background: #f8f9fa; padding: 30px; border-radius: 10px; border-left: 4px solid #E43636;">
                        <h2 style="color: #333; margin-top: 0;">Password Reset Request</h2>
                        <p style="color: #555; font-size: 16px; line-height: 1.6;">
                            We received a request to reset your password. Use the OTP below to reset your password:
                        </p>
                        
                        <div style="text-align: center; margin: 30px 0;">
                            <div style="background: #E43636; color: white; padding: 15px 30px; border-radius: 8px; font-size: 24px; font-weight: bold; letter-spacing: 3px; display: inline-block;">
                                ${text.match(/\d{6}/)?.[0] || text}
                            </div>
                        </div>
                        
                        <p style="color: #555; font-size: 14px;">
                            <strong>Important:</strong> This OTP will expire in 10 minutes for security reasons.
                        </p>
                        
                        <p style="color: #555; font-size: 14px;">
                            If you didn't request this password reset, please ignore this email or contact our support team.
                        </p>
                    </div>
                    
                    <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee;">
                        <p style="color: #999; font-size: 12px; margin: 0;">
                            © 2026 BikeCare. All rights reserved.<br>
                            This is an automated message, please do not reply to this email.
                        </p>
                    </div>
                </div>
            `
        });
        
        console.log("✅ Email sent successfully to:", to);
        console.log("📧 Message ID:", info.messageId);
        return info;
    } catch (error) {
        console.error("❌ Failed to send email:", error);
        throw error;
    }
};
