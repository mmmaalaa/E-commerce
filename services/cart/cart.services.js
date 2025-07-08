import Cart from "../../models/cart.model.js";
import Coupon from "../../models/coupon.model.js";
import Product from "../../models/product.model.js";
import apiError from "../../utils/apiError.js";

const totalPrice = (cart) => {
  return cart.cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );
};
export const addProductToCart = async (req, res, next) => {
  const { productId, color } = req.body;
  let cart = await Cart.findOne({ userId: req.user._id });
  const product = await Product.findById(productId);
  if (!cart) {
    cart = await Cart.create({
      userId: req.user._id,
      cartItems: [
        {
          productId: req.body.productId,
          price: product.price,
          color,
          quantity: 1,
        },
      ],
    });
  } else {
    const existingItem = cart.cartItems.find(
      (item) => item.productId.toString() === productId && item.color === color
    );
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.cartItems.push({
        productId: req.body.productId,
        price: product.price,
        color,
        quantity: 1,
      });
    }
  }
  cart.totalPrice = Math.round(totalPrice(cart) * 100) / 100;
  await cart.save();
  return res.status(200).json({
    status: "success",
    message: "Product added to cart successfully",
    data: cart,
  });
};

export const getCart = async (req, res, next) => {
  const cart = await Cart.findOne({ userId: req.user._id });
  if (!cart) {
    return next(new apiError("Cart not found", 404));
  }
  return res.status(200).json({
    lengthOfCart: cart.cartItems.length,
    status: "success",
    data: cart,
  });
};
export const deleteCart = async (req, res,next)=>{
  const cart = await Cart.findOneAndDelete({ userId: req.user._id });
  if (!cart) {
    return next(new apiError("Cart not found", 404));
  }
  return res.status(204).json();
}
export const removeProductFromCart = async (req, res, next) => {
  const { productId } = req.params;

  const cart = await Cart.findOneAndUpdate(
    { userId: req.user._id },
    {
      $pull: { cartItems: { _id: productId } }, // remove item where cartItems.productId == productId
    },
    { new: true, runValidators: true }
  );

  if (!cart) {
    return next(new apiError("Cart not found", 404));
  }

  // Optionally, recalculate total price
  cart.totalPrice = Math.round(totalPrice(cart) * 100) / 100;
  await cart.save();

  return res.status(200).json({
    message: "Product removed from Cart",
    data: cart,
  });
};
export const removeAllFromCart = async (req, res, next) => {
  const cart = await Cart.findOneAndUpdate(
    { userId: req.user._id },
    {
      $set: { cartItems: [] }, // clear all items in the cart
      $unset: { totalPrice: "", totalPriceAfterDiscount: "" }, // optionally unset total price fields
    },
    { new: true, runValidators: true }
  );

  if (!cart) {
    return next(new apiError("Cart not found", 404));
  }
  return res.status(204).json();
};

export const updateCartItemQuantity = async (req, res, next) => {
  const { quantity } = req.body;

  if (quantity < 1) {
    return next(new apiError("Quantity must be at least 1", 400));
  }

  const cart = await Cart.findOneAndUpdate(
    { userId: req.user._id, "cartItems._id": req.params.productId },
    { $set: { "cartItems.$.quantity": quantity } },
    { new: true, runValidators: true }
  );

  if (!cart) {
    return next(new apiError("Cart or product not found", 404));
  }

  cart.totalPrice = Math.round(totalPrice(cart) * 100) / 100;
  await cart.save();

  return res.status(200).json({
    status: "success",
    data: cart,
  });
};

export const applyCoupon = async (req, res, next) => {
  const { coupon: couponName } = req.body;
  const userId = req.user._id;

  // Input validation
  if (!couponName?.trim()) {
    return next(new apiError("Coupon name is required", 400));
  }

  // Find valid coupon
  const coupon = await Coupon.findOne({
    name: couponName.trim(),
    expiryDate: { $gt: new Date() },
  });

  if (!coupon) {
    return next(new apiError("Invalid or expired coupon", 400));
  }

  // Check if user already used this coupon
  if (req.user.usedCoupons.includes(coupon._id)) {
    return next(new apiError("Coupon already used", 400));
  }

  // Find user's cart
  const cart = await Cart.findOne({ userId });
  if (!cart) {
    return next(new apiError("Cart not found", 404));
  }

  // Check if cart is empty
  if (!cart.totalPrice || cart.totalPrice <= 0) {
    return next(new apiError("Cannot apply coupon to empty cart", 400));
  }

  // Check if coupon already applied
  if (cart.appliedCoupon) {
    return next(new apiError("A coupon is already applied to this cart", 400));
  }

  // Calculate discount
  const discountAmount = Math.round((cart.totalPrice * coupon.discount) / 100);
  const totalAfterDiscount = Math.max(0, cart.totalPrice - discountAmount);

  // Apply coupon to cart
  cart.totalPriceAfterDiscount = totalAfterDiscount;
  cart.appliedCoupon = coupon._id;
  cart.discountAmount = discountAmount;

  await cart.save();

  // Response
  return res.status(200).json({
    status: "success",
    message: "Coupon applied successfully",
    data: {
      originalPrice: cart.totalPrice,
      discountAmount,
      totalPriceAfterDiscount: totalAfterDiscount,
      coupon: {
        name: coupon.name,
        discount: coupon.discount,
        _id: coupon._id,
      },
    },
  });
};
