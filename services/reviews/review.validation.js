import { check } from "express-validator";
import Product from "../../models/product.model.js";
import Review from "../../models/review.model.js";

// Custom validation functions for better reusability
const validateReviewOwnership = async (reviewId, userId) => {
  const review = await Review.findById(reviewId);
  if (!review) {
    throw new Error("Review not found");
  }
  // console.log(review.user._id.toString(), userId.toString());
  if (review.user._id.toString() !== userId.toString()) {
    throw new Error("You can only modify your own reviews");
  }
  return review;
};

const validateProductExists = async (productId) => {
  const product = await Product.findById(productId);
  if (!product) {
    throw new Error("Product not found");
  }
  return product;
};

const validateUniqueReview = async (userId, productId) => {
  const existingReview = await Review.findOne({
    user: userId,
    product: productId,
  });
  if (existingReview) {
    throw new Error("You have already reviewed this product");
  }
};

const preventFieldUpdate = (fieldName) => {
  return check(fieldName).custom((value) => {
    if (value !== undefined) {
      throw new Error(`${fieldName} field cannot be updated`);
    }
    return true;
  });
};

// Common validation rules
const mongoIdValidation = (field) =>
  check(field).isMongoId().withMessage(`Invalid ${field} ID`);

const ratingValidation = (isRequired = false) => {
  const validation = check("rating")
    .isNumeric()
    .withMessage("Rating must be a number")
    .isInt({ min: 1, max: 5 })
    .withMessage("Rating must be between 1 and 5");

  return isRequired
    ? validation.notEmpty().withMessage("Rating is required")
    : validation.optional();
};

const reviewRules = {
  getReview: [mongoIdValidation("id")],

  updateReview: [
    check("id")
      .isMongoId()
      .withMessage("Invalid ID")
      .custom(async (value, { req }) => {
        if (req.user.role === "user") {
          await validateReviewOwnership(value, req.user._id);
        }
        return true;
      }),
    ratingValidation(false),
    check("title")
      .optional()
      .trim()
      .isLength({ min: 1, max: 200 })
      .withMessage("Title must be between 1 and 200 characters"),
    preventFieldUpdate("user"),
    preventFieldUpdate("product"),
  ],

  deleteReview: [
    check("id")
      .isMongoId()
      .withMessage("Invalid ID")
      .custom(async (value, { req }) => {
        if (req.user.role === "user") {
          await validateReviewOwnership(value, req.user._id);
        }
        return true;
      }),
  ],

  createReview: [
    check("content")
      .optional()
      .trim()
      .isLength({ min: 1, max: 500 })
      .withMessage("Title must be between 1 and 500 characters"),

    ratingValidation(true),

    check("user")
      .notEmpty()
      .withMessage("User ID is required")
      .isMongoId()
      .withMessage("Invalid User ID"),

    check("product")
      .notEmpty()
      .withMessage("Product ID is required")
      .isMongoId()
      .withMessage("Invalid Product ID")
      .custom(async (value, { req }) => {
        // Validate product exists
        await validateProductExists(value);

        // Validate unique review
        await validateUniqueReview(req.body.user, value);

        return true;
      }),

  ],
};

export default reviewRules;
