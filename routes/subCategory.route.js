import { Router } from "express";
import validationMiddleware from "../middlewares/validation.js";
import * as subcategoryService from "../services/subCategory/subCategory.service.js";
import subcategoryRules from "../services/subCategory/subCategory.validation.js";
import asyncHandler from "../utils/asyncHandler.js";

const router = Router({mergeParams: true});
router
  .route("/")
  .post(
    subcategoryService.CategoryID,
    subcategoryRules.createSubCategory,
    validationMiddleware,
    asyncHandler(subcategoryService.createSubCategory)
  )
  .get(subcategoryService.getAllSubCategories);
router
  .route("/:id")
  .get(
    subcategoryRules.getSubCategory,
    validationMiddleware,
    asyncHandler(subcategoryService.getSubCategory)
  )
  .patch(
    subcategoryRules.updateCategory,
    validationMiddleware,
    asyncHandler(subcategoryService.updateSubCategory)
  )
  .delete(
    subcategoryRules.deleteCategory,
    validationMiddleware,
    asyncHandler(subcategoryService.deleteSubCategory)
  );
export default router;
