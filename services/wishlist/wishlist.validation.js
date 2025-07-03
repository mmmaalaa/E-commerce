import e from "express";
import { check } from "express-validator";

const isProductIdValid = () => {
  return check("productId")
    .notEmpty()
    .withMessage("Product ID is required")
    .isMongoId()
    .withMessage("Invalid Product ID format");
};
const wishlistRules = {
  addToWishlist: isProductIdValid(),
  removeFromWishlist: isProductIdValid(),
};

export default wishlistRules;