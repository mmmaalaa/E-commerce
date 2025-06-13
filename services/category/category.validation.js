import { check } from "express-validator";

 const categoryRules = {
  getCategory: check("id").isMongoId().withMessage("invalid mongo ID"),
  updateCategory: check("id").isMongoId().withMessage("invalid mongo ID"),
  deleteCategory: check("id").isMongoId().withMessage("invalid mongo ID"),
  createCategory: check("name")
    .notEmpty()
    .withMessage("Category name is required")
    .isLength({ min: 3 })
    .withMessage("Category name must be at least 3 characters long")
    .isLength({ max: 32 })
    .withMessage("Category name must be at most 32 characters long"),

};



export default categoryRules;