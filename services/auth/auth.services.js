import jwt from "jsonwebtoken";
import User from "../../models/user.model.js";
import { comparePassword } from "../../utils/hashingPassword.js";
import apiError from "../../utils/apiError.js";
import OTP from "../../models/OTP.model.js";
import OTPEvent from "../../utils/emailEvent.js";

export const register = async (req, res, next) => {
  const user = await User.create({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,

  });
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  res.status(201).json({
    status: "success",
    message: "User created successfully",
    token,
  });
};

export const login = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await comparePassword(password, user.password))) {
    return next(new apiError("Invalid email or password", 401));
  }
  if (user.active === false) {
    throw new apiError(
      "Your account is deactivated, please contact support.",
      403
    );
  }
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
  res.status(200).json({
    status: "success",
    message: "User logged in successfully",
    token,
  });
};

export const forgotPassword = async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(
      new apiError("user not found with this email, you can register", 404)
    );
  }
  OTPEvent.emit("sendOtp", user.email, "password_reset");
  res.status(200).json({
    status: "success",
    message: "OTP sent to your email for password reset",
  });
};

export const verifyOTP = async (req, res, next) => {
  const { email, otp } = req.body;

  const otpDoc = await OTP.findOne({ email, purpose: "password_reset" });
  const comparedOtp = await comparePassword(otp, otpDoc?.OTP);
  if (!otpDoc || !comparedOtp || otpDoc.expiresAt < new Date()) {
    return next(new apiError("Invalid or expired OTP", 400));
  }
  const resetToken = jwt.sign(
    { email: otpDoc.email, purpose: "password_reset" },
    process.env.JWT_SECRET,
    {
      expiresIn: "10m",
    }
  );
  await OTP.deleteOne({ _id: otpDoc._id });
  res.status(200).json({
    status: "success",
    message: "OTP verified successfully",
    resetToken,
  });
};

export const resetPassword = async (req, res, next) => {
  const { newPassword, resetToken } = req.body;
  const { email } = jwt.verify(resetToken, process.env.JWT_SECRET);
  const user = await User.findOne({ email });
  if (!user) {
    return next(new apiError("User not found", 404));
  }
  user.password = newPassword;
  await user.save();
  res.status(200).json({
    status: "success",
    message: "Password reset successfully",
  });
};
