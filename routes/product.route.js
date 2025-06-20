import { Router } from "express";
import * as productService from "../services/product/product.service.js";
import productRules from "../services/product/product.validation.js";
import asyncHandler from "../utils/asyncHandler.js";

import validationMiddleware from "../middlewares/validation.js";
import {
  uploadMultipleImages,
  uploadSingleImage,
} from "../middlewares/uploadImageMiddleware.js";

const router = Router();

router
  .route("/")
  .post(
    uploadMultipleImages([
      { name: "imageCover", maxCount: 1 },
      { name: "images", maxCount: 5 },
    ]),
    productService.resizeImage,
    productRules.createRules,
    validationMiddleware,
    asyncHandler(productService.createProduct)
  )
  .get(asyncHandler(productService.getAllProducts));

router
  .route("/:id")
  .get(
    productRules.getRules,
    validationMiddleware,
    asyncHandler(productService.getProduct)
  )
  .patch(
    productRules.updateRules,
    validationMiddleware,
    asyncHandler(productService.updateProduct)
  )
  .delete(
    productRules.deleteRules,
    validationMiddleware,
    asyncHandler(productService.deleteProduct)
  );
export default router;
