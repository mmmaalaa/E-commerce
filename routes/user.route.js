import { Router } from "express";
import * as userService from "../services/user/user.services.js";
import userRules from "../services/user/user.validation.js";
import asyncHandler from "../utils/asyncHandler.js";
import validationMiddleware from "../middlewares/validation.js";
import { uploadSingleImage } from "../middlewares/uploadImageMiddleware.js";
import { allowedTo, authentication } from "../middlewares/authentication.js";
import { USER_ROLES } from "../models/user.model.js";

const router = Router();

// ? User routes
router
  .route("/getMe")
  .get(
    authentication,
    asyncHandler(userService.getMe),
    asyncHandler(userService.getUser)
  );

router
  .route("/updateLoggedUserPass")
  .patch(
    authentication,
    userService.updatedLoggedUserPass,
    userService.updatePassword
  );

router
  .route("/updateLoggedUser")
  .patch(
    authentication,
    uploadSingleImage("image"),
    userService.resizeImage,
    asyncHandler(userService.updatedLoggedUser),
    asyncHandler(userService.updateUser)
  );

router
  .route("/deActivateAccount")
  .delete(authentication, userService.deActivateAccount);
  
// ? Admin routes
router.use(authentication, allowedTo(USER_ROLES.ADMIN));
router
  .route("/")
  .post(
    uploadSingleImage("profilePicture"),
    userService.resizeImage,
    userRules.createUser,
    validationMiddleware,
    asyncHandler(userService.createUser)
  )
  .get(asyncHandler(userService.getAllUsers));

router
  .route("/:id")
  .get(
    userRules.getUser,
    validationMiddleware,
    asyncHandler(userService.getUser)
  )
  .patch(
    uploadSingleImage("image"),
    userService.resizeImage,
    userRules.updateUser,
    validationMiddleware,
    asyncHandler(userService.updateUser)
  )
  .delete(asyncHandler(userService.deleteUser));

router.patch(
  "/:id/updatePassword",
  userRules.updatePassword,
  validationMiddleware,
  asyncHandler(userService.updatePassword)
);

export default router;
