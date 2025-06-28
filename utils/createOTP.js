import OTP from "../models/OTP.model.js";
import { hashPassword } from "./hashingPassword.js";

const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const createOTP = async (email, purpose = "verification") => {
  // Delete any existing OTPs for this email and purpose
  await OTP.deleteMany({ email, purpose });

  const otp = generateOTP();
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
  const otpHash =await hashPassword(otp);
  await OTP.create({ email, OTP: otpHash, purpose, expiresAt });
  return otp;
};

export default createOTP;
