import { check } from "express-validator";

const subcategoryRules = {
  //? get subcategory validation
  getSubCategory: check("id").isMongoId().withMessage("invalid mongo ID"),
  //? update subcategory validation
  updateCategory: [
    check("id").isMongoId().withMessage("invalid mongo ID"),
    check("name")
      .optional()
      .isString()
      .isLength({ min: 2 })
      .withMessage("SubCategory name must be at least 2 characters long")
      .isLength({ max: 32 })
      .withMessage("SubCategory name must be at most 32 characters long"),
    check("category").optional().isMongoId().withMessage("invalid mongo ID"),
  ],
  //? delete subcategory validation
  deleteCategory: check("id").isMongoId().withMessage("invalid mongo ID"),
  //? create subcategories validation
  createSubCategory: [
    check("name")
      .notEmpty()
      .withMessage("SubCategory name is required")
      .isString()
      .isLength({ min: 2 })
      .withMessage("SubCategory name must be at least 2 characters long")
      .isLength({ max: 32 })
      .withMessage("SubCategory name must be at most 32 characters long"),
    check("category")
      .notEmpty()
      .withMessage("Category is required")
      .isMongoId()
      .withMessage("invalid mongo ID"),
  ],
};

export default subcategoryRules;
