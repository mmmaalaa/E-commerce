import { Router } from "express";
import * as productService from "../services/product/product.service.js";
import productRules from "../services/product/product.validation.js";
import asyncHandler from "../utils/asyncHandler.js";

import validationMiddleware from "../middlewares/validation.js";
import {
  uploadMultipleImages,
} from "../middlewares/uploadImageMiddleware.js";
import { allowedTo, authentication } from "../middlewares/authentication.js";
import { USER_ROLES } from "../models/user.model.js";

const router = Router();

router
  .route("/")
  .post(
    authentication,
    allowedTo(USER_ROLES.ADMIN),
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
    authentication,
    allowedTo(USER_ROLES.ADMIN),
    productRules.updateRules,
    validationMiddleware,
    asyncHandler(productService.updateProduct)
  )
  .delete(
    authentication,
    allowedTo(USER_ROLES.ADMIN),
    productRules.deleteRules,
    validationMiddleware,
    asyncHandler(productService.deleteProduct)
  );
export default router;
