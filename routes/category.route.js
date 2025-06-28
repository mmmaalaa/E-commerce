import { Router } from "express";
import * as categoryService from "../services/category/category.service.js";
import asyncHandler from "../utils/asyncHandler.js";
import categoryRules from "../services/category/category.validation.js";
import validationMiddleware from "../middlewares/validation.js";
import subCategoryRouter from "./subCategory.route.js";
import { uploadSingleImage } from "../middlewares/uploadImageMiddleware.js";
import { allowedTo, authentication } from "../middlewares/authentication.js";
import { USER_ROLES } from "../models/user.model.js";
 // Configure multer for file uploads
const router = Router();

router.use('/:categoryId/subcategories', subCategoryRouter);
router
  .route("/")
  .post(
    authentication,
    allowedTo(USER_ROLES.ADMIN),
    uploadSingleImage("image"),
    asyncHandler(categoryService.resizeImage),
    categoryRules.createCategory,
    validationMiddleware,
    asyncHandler(categoryService.createCategory)
  )
  .get(asyncHandler(categoryService.getAllCategories));

router
  .route("/:id")
  .get(
    categoryRules.getCategory,
    validationMiddleware,
    asyncHandler(categoryService.getCategory)
  )
  .patch(
    authentication,
    allowedTo(USER_ROLES.ADMIN),
    uploadSingleImage("image"),
    asyncHandler(categoryService.resizeImage),
    categoryRules.updateCategory,
    validationMiddleware,
    asyncHandler(categoryService.updateCategory)
  )
  .delete(
    authentication,
    allowedTo(USER_ROLES.ADMIN),
    categoryRules.deleteCategory,
    validationMiddleware,
    asyncHandler(categoryService.deleteCategory)
  );
export default router;
