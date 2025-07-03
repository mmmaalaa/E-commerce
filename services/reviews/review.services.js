
import Review from "../../models/review.model.js";
import {
  createOne,
  deleteOne,
  getAll,
  getOne,
  updateOne,
} from "../handlerFactory.js";

export const productID = async (req, res, next) => {
  if (!req.body.product) req.body.product = req.params.productId;
  if(!req.body.user) {
    req.body.user = req.user._id; // Assuming req.user is populated by authentication middleware
  }
  next();
};

export const createReview = createOne(Review);

export const getAllReviews = getAll(Review, "Review");

export const getReview = getOne(Review);

export const updateReview = updateOne(Review);

export const deleteReview = deleteOne(Review);
