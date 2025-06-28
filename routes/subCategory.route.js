import { Router } from "express";
import validationMiddleware from "../middlewares/validation.js";
import * as subcategoryService from "../services/subCategory/subCategory.service.js";
import subcategoryRules from "../services/subCategory/subCategory.validation.js";
import asyncHandler from "../utils/asyncHandler.js";
import { allowedTo, authentication } from "../middlewares/authentication.js";
import { USER_ROLES } from "../models/user.model.js";

const router = Router({mergeParams: true});
router
  .route("/")
  .post(
    authentication,
    allowedTo(USER_ROLES.ADMIN),
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
    authentication,
    allowedTo(USER_ROLES.ADMIN),
    subcategoryRules.updateCategory,
    validationMiddleware,
    asyncHandler(subcategoryService.updateSubCategory)
  )
  .delete(
    authentication,
    allowedTo(USER_ROLES.ADMIN),
    subcategoryRules.deleteCategory,
    validationMiddleware,
    asyncHandler(subcategoryService.deleteSubCategory)
  );
export default router;
