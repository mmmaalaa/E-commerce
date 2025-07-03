import Product from "../../models/product.model.js";
import User from "../../models/user.model.js";

export const addToWishList = async (req, res, next) => {
  const { productId } = req.body;
  const product = await Product.findById(productId);
  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $addToSet: { wishlist: productId },
    },
    { new: true, runValidators: true }
  );
  return res.status(200).json(
    {
      message: "Product added to wishlist",
      data: user.wishlist,
    },
    { new: true, runValidators: true }
  );
};
export const removeFromWishList = async (req, res, next) => {
  const { productId } = req.params;

  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $pull: { wishlist: productId },
    },
    { new: true, runValidators: true }
  );
  return res.status(200).json(
    {
      message: "Product removed from wishlist",
      data: user.wishlist,
    },
    { new: true, runValidators: true }
  );
};

export const getWishList = async (req, res, next) => {
  const user = await User.findById(req.user._id).populate("wishlist");
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  return res.status(200).json(
    {
      message: "Wishlist retrieved successfully",
      data: user.wishlist,
    },
    { new: true, runValidators: true }
  );
};
