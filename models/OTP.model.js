import { model, Schema } from "mongoose";

const OTPSchema = new Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    OTP: {
      type: String,
      required: [true, "OTP is required"],
    },
    purpose: {
      type: String,
      enum: ["verification", "password_reset"],
      default: "verification",
    },
    expiresAt: {
      type: Date,
      required: [true, "Expiration time is required"],
      default: function () {
        return new Date(Date.now() + 10 * 60 * 1000); // OTP valid for 10 minutes
      },
    },
  },
  { timestamps: true }
);
OTPSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
const OTP = model("OTP", OTPSchema);

export default OTP;
