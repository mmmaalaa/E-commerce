import { check } from "express-validator";

const brandRules = {
  getBrand: check("id").isMongoId().withMessage("invalid mongo ID"),
  updateBrand: check("id").isMongoId().withMessage("invalid mongo ID"),
  deleteBrand: check("id").isMongoId().withMessage("invalid mongo ID"),
  createBrand: check("name")
    .notEmpty()
    .withMessage("Brand name is required")
    .isLength({ min: 3 })
    .withMessage("Brand name must be at least 3 characters long")
    .isLength({ max: 32 })
    .withMessage("Brand name must be at most 32 characters long"),
};

export default brandRules;
