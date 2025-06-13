import apiError from "./apiError.js";

const asyncHandler = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch((error) => {
      if (Object.keys(error).length === 0) {
        return next(new apiError(error.message, 500));
      }
      return next(new apiError(error));
    });
  };
};

export default asyncHandler;
