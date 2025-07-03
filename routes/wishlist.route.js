import { Router } from "express";
import { authentication } from "../middlewares/authentication.js";
import * as wishlistServices from "../services/wishlist/wishlist.services.js";
import wishlistRules from "../services/wishlist/wishlist.validation.js";
import validationMiddleware from "../middlewares/validation.js";

const router = Router();
router
  .route("/")
  .post(
    authentication,
    wishlistRules.addToWishlist,
    validationMiddleware,
    wishlistServices.addToWishList
  )
  .get(authentication, wishlistServices.getWishList);
router
  .route("/:productId")
  .delete(
    authentication,
    wishlistRules.removeFromWishlist,
    validationMiddleware,
    wishlistServices.removeFromWishList
  );

export default router;
