import Coupon from "../../models/coupon.model.js";
import {
  deleteOne,
  updateOne,
  getOne,
  createOne,
  getAll,
} from "../handlerFactory.js";

export const createCoupon = createOne(Coupon);

export const getAllCoupons = getAll(Coupon, "Coupon");

export const getCoupon = getOne(Coupon);

export const updateCoupon = updateOne(Coupon);

export const deleteCoupon = deleteOne(Coupon);
