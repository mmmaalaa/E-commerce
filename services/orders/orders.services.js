import mongoose from "mongoose";
import Cart from "../../models/cart.model.js";
import Order from "../../models/order.model.js";
import Product from "../../models/product.model.js";
import apiError from "../../utils/apiError.js";
import { getAll } from "../handlerFactory.js";
const calculatePrices = (cartPrice, address, shippingMethod = "standard") => {
  const taxRate = 0.14;
  const taxPrice = Math.round(cartPrice * taxRate * 100) / 100;

  let shippingPrice = 0;
  const city = address?.city?.toLowerCase();

  if (!city) throw new Error("No valid city found in address");

  const isCairo = city === "cairo" || city === "القاهرة";

  if (shippingMethod === "express") {
    shippingPrice = isCairo ? 50 : 80;
  } else {
    shippingPrice = isCairo ? 30 : 50;
  }

  return { taxPrice, shippingPrice };
};

export const createCashOrder = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const cart = await Cart.findById(req.params.cartId).session(session);
    if (!cart) {
      throw new apiError("Cart not found", 404);
    }

    let cartPrice = cart.totalPrice;

    if (cart.appliedCoupon && cart.totalPriceAfterDiscount) {
      if (!req.user.usedCoupons.includes(cart.appliedCoupon)) {
        req.user.usedCoupons.push(cart.appliedCoupon);
        await req.user.save({ session });
      }
      cartPrice = cart.totalPriceAfterDiscount;
    }
    const shippingAddress = req.user.addresses?.[0];
    if (!shippingAddress) {
      throw new apiError("User has no saved address", 400);
    }
    const { taxPrice, shippingPrice } = calculatePrices(
      cartPrice,
      shippingAddress
    );
    const totalPrice =
      Math.round((cartPrice + taxPrice + shippingPrice) * 100) / 100;

    const productIds = cart.cartItems.map((item) => item.productId);
    const products = await Product.find({ _id: { $in: productIds } }).session(
      session
    );

    for (const item of cart.cartItems) {
      const product = products.find(
        (p) => p._id.toString() === item.productId.toString()
      );
      if (!product) {
        throw new apiError(`Product not found: ${item.productId}`, 404);
      }
      if (product.quantity < item.quantity) {
        throw new apiError(
          `Not enough stock for product: ${product.name}`,
          400
        );
      }
    }

    const order = await Order.create(
      [
        {
          user: req.user._id,
          cartItems: cart.cartItems,
          taxPrice,
          shippingPrice,
          shippingAddress,
          totalPrice,
        },
      ],
      { session }
    );

    const bulkOps = cart.cartItems.map((item) => ({
      updateOne: {
        filter: { _id: item.productId },
        update: {
          $inc: {
            quantity: -item.quantity,
            sold: +item.quantity,
          },
        },
      },
    }));
    await Product.bulkWrite(bulkOps, { session });

    await Cart.findByIdAndDelete(req.params.cartId).session(session);

    await session.commitTransaction();
    session.endSession();

    return res.status(201).json({
      status: "success",
      message: "Order created successfully",
      data: order[0],
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    return next(err);
  }
};

export const filterLoggedUsers = async (req, res, next) => {
  if (req.user.role === "user") {
    req.filter = { user: req.user._id };
  }
  next();
};

export const getAllOrders = getAll(Order, "Order");
