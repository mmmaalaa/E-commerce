import { Router } from "express";
import * as reviewServices from "../services/reviews/review.services.js";
import asyncHandler from "../utils/asyncHandler.js";
import { authentication } from "../middlewares/authentication.js";
import reviewRules from "../services/reviews/review.validation.js";
import validationMiddleware from "../middlewares/validation.js";

const router = Router({mergeParams: true});
router
  .route("/")
  .post(
    authentication,
    reviewServices.productID,
    reviewRules.createReview,
    validationMiddleware,
    asyncHandler(reviewServices.createReview)
  )
  .get(asyncHandler(reviewServices.getAllReviews));


router
  .route("/:id")
  .get(
    reviewRules.getReview,
    validationMiddleware,
    asyncHandler(reviewServices.getReview)
  )
  .patch(
    authentication,
    reviewRules.updateReview,
    validationMiddleware,
    asyncHandler(reviewServices.updateReview)
  )
  .delete(
    authentication,
    reviewRules.deleteReview,
    validationMiddleware,
    asyncHandler(reviewServices.deleteReview)
  );
export default router;
