import { model, Schema } from "mongoose";

const cartSchema = new Schema(
  {
    cartItems: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: 1,
        },
        price: {
          type: Number,
          required: true,
        },
        color: String,
      },
    ],
    totalPrice: Number,
    totalPriceAfterDiscount: Number,
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    appliedCoupon: {
      type: Schema.Types.ObjectId,
      ref: "Coupon",
    },
  },
  { timestamps: true }
);

const Cart = model("Cart", cartSchema)

export default Cart;