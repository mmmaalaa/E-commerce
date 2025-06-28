import User from "../models/user.model.js";
import apiError from "../utils/apiError.js";
import jwt from "jsonwebtoken";
import asyncHandler from "../utils/asyncHandler.js";

export const authentication = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    throw new apiError(
      "You are not logged in! Please log in to get access.",
      401
    );
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded.id);
  if (!user) {
    throw new apiError(
      "The user belonging to this token does no longer exist, please register again",
      401
    );
  }
  const userPasswordChangedAt = user.passwordChangedAt
    ? parseInt(user.passwordChangedAt.getTime() / 1000)
    : null;
  if(user.active === false) {
    throw new apiError("Your account is deactivated, please contact support.", 403);
  }
  if (user.passwordChangedAt && userPasswordChangedAt > decoded.iat) {
    throw new apiError(
      "User recently changed password! Please log in again.",
      401
    );
  }
  req.user = user;
  next();
};

export const allowedTo = (...roles) => {
  return (req, res, next) => {
    console.log(req.user.role, roles);
    if (!roles.includes(req.user.role)) {
      return next(
        new apiError("You do not have permission to perform this action", 403)
      );
    }
    next();
  };
};
