import { Router } from "express";
import * as brandService from "../services/brand/brand.service.js";
import asyncHandler from "../utils/asyncHandler.js";
import brandRules from "../services/brand/brand.validation.js";
import validationMiddleware from "../middlewares/validation.js";
import { uploadSingleImage } from "../middlewares/uploadImageMiddleware.js";
import { allowedTo, authentication } from "../middlewares/authentication.js";
import { USER_ROLES } from "../models/user.model.js";

const router = Router();

router
  .route("/")
  .post(
    authentication,
    allowedTo(USER_ROLES.ADMIN),
    uploadSingleImage("image"),
    brandService.resizeImage,
    brandRules.createBrand,
    validationMiddleware,
    asyncHandler(brandService.createBrand)
  )
  .get(asyncHandler(brandService.getAllBrands));

router
  .route("/:id")
  .get(
    brandRules.getBrand,
    validationMiddleware,
    asyncHandler(brandService.getBrand)
  )
  .patch(
    authentication,
    allowedTo(USER_ROLES.ADMIN),
    uploadSingleImage("image"),
    brandService.resizeImage,
    brandRules.updateBrand,
    validationMiddleware,
    asyncHandler(brandService.updateBrand)
  )
  .delete(
    authentication,
    allowedTo(USER_ROLES.ADMIN),
    brandRules.deleteBrand,
    validationMiddleware,
    asyncHandler(brandService.deleteBrand)
  );
export default router;
