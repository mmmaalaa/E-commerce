import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendEmails = async (email, otp, purpose = "verification") => {
  const subjects = {
    verification: "Account Verification OTP",
    password_reset: "Password Reset OTP",
  };
  const mailOptions = {
    from: `E_commerce <${process.env.EMAIL}>`,
    to: email,
    subject: subjects[purpose],
    html: `
      <h2>${
        purpose === "verification" ? "Account Verification" : "Password Reset"
      }</h2>
      <p>Your OTP is:</p>
      <h1 style="color: #007bff; font-size: 32px;">${otp}</h1>
      <p>This OTP will expire in 10 minutes.</p>
      <p>If you didn't request this, please ignore this email.</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};

export const subject = {
  activateAccount: "Activate your account",
  resetPassword: "Reset your password",
  emailChange: "Email Change Request",
};


export default sendEmails;
