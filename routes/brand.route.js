import { Router } from "express";
import * as brandService from "../services/brand/brand.service.js";
import asyncHandler from "../utils/asyncHandler.js";
import brandRules from "../services/brand/brand.validation.js";
import validationMiddleware from "../middlewares/validation.js";
import { uploadSingleImage } from "../middlewares/uploadImageMiddleware.js";

const router = Router();

router
  .route("/")
  .post(
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
    uploadSingleImage("image"),
    brandService.resizeImage,
    brandRules.updateBrand,
    validationMiddleware,
    asyncHandler(brandService.updateBrand)
  )
  .delete(
    brandRules.deleteBrand,
    validationMiddleware,
    asyncHandler(brandService.deleteBrand)
  );
export default router;
