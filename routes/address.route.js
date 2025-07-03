import { Router } from "express";
import { authentication } from "../middlewares/authentication.js";
import * as addressServices from "../services/address/address.services.js";
// import wishlistRules from "../services/wishlist/wishlist.validation.js";
// import validationMiddleware from "../middlewares/validation.js";

const router = Router();
router
  .route("/")
  .post(
    authentication,
    addressServices.addAddress
  )
  .get(authentication, addressServices.getAddresses);
router
  .route("/:addressId")
  .delete(
    authentication,
    addressServices.removeAddress
  );

export default router;
