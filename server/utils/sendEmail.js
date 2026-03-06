import nodemailer from "nodemailer";

console.log("MAILTRAP HOST:", process.env.MAILTRAP_HOST);
console.log(
    "MAILTRAP USER:",
    process.env.MAILTRAP_USER ? "LOADED" : "MISSING"
);

const transporter = nodemailer.createTransport({
    host: process.env.MAILTRAP_HOST,
    port: Number(process.env.MAILTRAP_PORT),
    secure: false,
    auth: {
        user: process.env.MAILTRAP_USER,
        pass: process.env.MAILTRAP_PASS,
    },
});

transporter.verify((error) => {
    if (error) {
        console.error("❌ Mailtrap SMTP error:", error);
    } else {
        console.log("✅ Mailtrap SMTP ready");
    }
});

export const sendEmail = async (to, text) => {
    await transporter.sendMail({
        from: '"BikeCare" <no-reply@bikecare.com>',
        to,
        subject: "Password Reset OTP",
        text,
    });
    console.log("📩 OTP captured in Mailtrap inbox");
};
