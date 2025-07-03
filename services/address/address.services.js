
import User from "../../models/user.model.js";

export const addAddress = async (req, res, next) => {

  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $addToSet: { addresses: req.body },
    },
    { new: true, runValidators: true }
  );
  return res.status(200).json(
    {
      message: "address added successfully",
      data: user.addresses,
    },
    { new: true, runValidators: true }
  );
};
export const removeAddress = async (req, res, next) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    {
      $pull: { addresses: {_id: req.params.addressId} },
    },
    { new: true, runValidators: true }
  );
  return res.status(200).json(
    {
      message: "address removed successfully",
      data: user.addresses,
    },
    { new: true, runValidators: true }
  );
};

export const getAddresses = async (req, res, next) => {
  const user = await User.findById(req.user._id)
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  return res.status(200).json(
    {
      message: "addresses retrieved successfully",
      data: user.addresses,
    },
    { new: true, runValidators: true }
  );
};
