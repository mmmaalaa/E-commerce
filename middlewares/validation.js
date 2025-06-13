import { validationResult } from "express-validator";
import apiError from "../utils/apiError.js";

const validationMiddleware = (req, res, next) => {
  const result = validationResult(req);
  if (!result.isEmpty()) {
    const errors = result.array().map((error) => error.msg);

    return next(new apiError(errors, 400));
  }
  next();
};

export default validationMiddleware;
