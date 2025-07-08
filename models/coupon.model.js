import { model, Schema } from "mongoose";

const couponSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "coupon name is required"],
      unique: [true, "coupon name must be unique"],
    },
    expiryDate: {
      type: Date,
      required: [true, "expiry date is required"],
    },
    discount: {
      type: Number,
      required: [true, "discount is required"],
      min: [0, "discount cannot be negative"],
    },
  },
  { timestamps: true }
);
couponSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
const Coupon = model("Coupon", couponSchema);

export default Coupon;
