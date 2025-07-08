import { Router } from "express";
import * as cartServices from "../services/cart/cart.services.js";
import { authentication } from "../middlewares/authentication.js";
import asyncHandler from "../utils/asyncHandler.js";

const router = Router();
router
  .route("/")
  .post(authentication, asyncHandler(cartServices.addProductToCart))
  .get(authentication, asyncHandler(cartServices.getCart))
  .delete(authentication, asyncHandler(cartServices.removeAllFromCart))
  
  router.delete(
    "/delete-cart",
    authentication,
    asyncHandler(cartServices.deleteCart)
  );
  router.put(
    "/apply-coupon",
    authentication,
    asyncHandler(cartServices.applyCoupon)
  );

router
  .route("/:productId")
  .delete(authentication, asyncHandler(cartServices.removeProductFromCart))
  .patch(authentication, asyncHandler(cartServices.updateCartItemQuantity));

export default router;
