import { check } from "express-validator";
import Category from "../../models/category.model.js";
import mongoose from "mongoose";
import SubCategory from "../../models/subCategory.model.js";

// Common validation rules as reusable functions
const createCommonRules = () => {
  return {
    title: check("title")
      .isLength({ min: 3, max: 100 })
      .withMessage("Product title must be at least 3 characters long")
      .trim(),

    description: check("description")
      .isLength({ min: 20, max: 2000 })
      .withMessage("Product description must be at least 20 characters long")
      .trim(),

    price: check("price")
      .isNumeric()
      .withMessage("Product price must be a number")
      .toFloat()
      .custom((value) => {
        if (value < 0) {
          throw new Error("Product price must be at least 0");
        }
        return true;
      }),

    quantity: check("quantity")
      .isNumeric()
      .withMessage("Product quantity must be a number")
      .toFloat()
      .custom((value) => {
        if (value < 0) {
          throw new Error("Product quantity must be at least 0");
        }
        return true;
      }),

    imageCover: check("imageCover")
      .notEmpty()
      .withMessage("Product cover image is required"),

    images: check("images")
      .isArray()
      .withMessage("Product images must be an array")
      .custom((value) => {
        if (value.length < 1) {
          throw new Error("Product images must contain at least one image");
        }
        return true;
      }),

    category: check("category")
      .isMongoId()
      .withMessage("Product category must be a valid MongoDB ID")
      .custom(async (value) => {
        const category = await Category.findById(value);
        if (!category) {
          throw new Error("Product category not found");
        }
        return true;
      }),

    subCategory: check("subCategory")
      .isArray()
      .isMongoId()
      .withMessage("Product subcategory must be a valid MongoDB ID")
      .custom(async (value) => {
        const subCategory = await SubCategory.find({
          _id: { $in: value },
        });
        if (subCategory.length !== value.length) {
          throw new Error("Some product subcategories not found");
        }
      }).custom(async (value,{ req }) => {
        const subcategories = await SubCategory.find({
          category: req.body.category,
        })
        // console.log(subcategories[0]._id)
        const subcategoryIds = subcategories.map((subcategory) => {
          return subcategory._id.toString();
        });
        const isValid = value.every((subcategory) => {
          return subcategoryIds.includes(subcategory);
        });
        if (!isValid) {
          throw new Error("Product subcategory must belong to the category");
        }
        return true;
      }),

    brand: check("brand")
      .isMongoId()
      .withMessage("Product brand must be a valid MongoDB ID"),

    priceAfterDiscount: check("priceAfterDiscount").custom((value, { req }) => {
      if (value && value > req.body.price) {
        throw new Error(
          "Product price after discount must be less than the original price"
        );
      }
      return true;
    }),

    colors: check("colors")
      .isArray()
      .withMessage("Product color must be an array")
      .custom((value) => {
        if (value.length < 1) {
          throw new Error("Product color must contain at least one color");
        }
        return true;
      }),

    ratings: check("ratings")
      .isNumeric()
      .withMessage("Product ratings must be a number"),

    ratingQuantity: check("ratingQuantity")
      .isNumeric()
      .withMessage("Product rating quantity must be a number"),
  };
};

// Helper to get a validation rule with optional flag
const makeOptional = (rule) => rule.optional();

// Helper to make a rule required
const makeRequired = (rule) =>
  rule.notEmpty().withMessage(`${rule.builder.fields[0]} is required`);

const productRules = {
  // Get product validation rule
  getRules: check("id").isMongoId().withMessage("invalid mongo ID"),

  // Delete product validation rule
  deleteRules: check("id").isMongoId().withMessage("invalid mongo ID"),

  // Update product validation rules
  updateRules: [
    check("id").isMongoId().withMessage("invalid mongo ID"),
    ...Object.values(createCommonRules()).map((rule) => makeOptional(rule)),
  ],

  // Create product validation rules
  createRules: [
    // Required fields for creation
    makeRequired(createCommonRules().title),
    makeRequired(createCommonRules().description),
    makeRequired(createCommonRules().price),
    makeRequired(createCommonRules().quantity),
    makeRequired(createCommonRules().imageCover),
    makeRequired(createCommonRules().category),

    // Optional fields for creation
    makeOptional(createCommonRules().images),
    makeOptional(createCommonRules().subCategory),
    makeOptional(createCommonRules().brand),
    makeOptional(createCommonRules().priceAfterDiscount),
    makeOptional(createCommonRules().colors),
    makeOptional(createCommonRules().ratings),
    makeOptional(createCommonRules().ratingQuantity),
  ],
};

export default productRules;
