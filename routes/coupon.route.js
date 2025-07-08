import { Router } from "express";
import * as couponService from "../services/coupons/coupons.services.js";
import asyncHandler from "../utils/asyncHandler.js";
import { allowedTo, authentication } from "../middlewares/authentication.js";
import { USER_ROLES } from "../models/user.model.js";
import couponRules from "../services/coupons/coupons.validation.js";
import validationMiddleware from "../middlewares/validation.js";

const router = Router();

router
  .route("/")
  .post(
    authentication,
    allowedTo(USER_ROLES.ADMIN),
    couponRules.createCoupon,
    validationMiddleware,
    asyncHandler(couponService.createCoupon)
  )
  .get(asyncHandler(couponService.getAllCoupons));

router
  .route("/:id")
  .get(asyncHandler(couponService.getCoupon))
  .patch(
    authentication,
    allowedTo(USER_ROLES.ADMIN),
    asyncHandler(couponService.updateCoupon)
  )
  .delete(
    authentication,
    allowedTo(USER_ROLES.ADMIN),
    asyncHandler(couponService.deleteCoupon)
  );
export default router;
