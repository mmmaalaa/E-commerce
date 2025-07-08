import { check } from "express-validator";

const couponRules = {
  createCoupon: [
    check("name")
      .notEmpty()
      .withMessage("Coupon name is required")
      .isLength({ min: 3 })
      .withMessage("Coupon name must be at least 3 characters long"),
    check("discount")
      .notEmpty()
      .withMessage("Discount is required")
      .isNumeric()
      .withMessage("Discount must be a number"),
    check("expiryDate")
      .notEmpty()
      .withMessage("Expiry date is required")
      .isISO8601()
      .withMessage("Expiry date must be a valid date")
      .custom((value) => {
        if (new Date(value) <= Date.now()) {
          throw new Error("Expiry date must be in the future");
        }
        return true;
      }),
    ,
  ],
};

export default couponRules;
