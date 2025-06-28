import sharp from "sharp";
import User from "../../models/user.model.js";
import {
  createOne,
  deleteOne,
  getAll,
  getOne,
  updateOne,
} from "../handlerFactory.js";
import { comparePassword } from "../../utils/hashingPassword.js";
import { compareSync } from "bcryptjs";

export const resizeImage = async (req, res, next) => {
  const fileName = `users-${Date.now()}.jpeg`;
  if (!req.file) {
    return next();
  }
  await sharp(req.file.buffer)
    .resize(600, 600)
    .toFormat("jpeg")
    .jpeg({ quality: 90 })
    .toFile(`uploads/users/${fileName}`);
  req.body.profilePicture = fileName;
  next();
};
export const createUser = createOne(User);

export const getAllUsers = getAll(User, "User");

export const getUser = getOne(User);

export const updateUser = updateOne(User);

export const deleteUser = deleteOne(User);

export const updatePassword = async (req, res, next) => {
  const { id } = req.params;
  const { currentPassword, newPassword } = req.body;
  // Find user in database (replace with your database logic)
  const user = await User.findById(id);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  // Verify current password
  const isCurrentPasswordValid = await comparePassword(
    currentPassword,
    user.password
  );
  if (!isCurrentPasswordValid) {
    return res.status(400).json({
      success: false,
      message: "Current password is incorrect",
    });
  }

  // Check if new password is different from current password
  const isSamePassword = await comparePassword(newPassword, user.password);
  if (isSamePassword) {
    return res.status(400).json({
      success: false,
      message: "New password must be different from current password",
    });
  }
  // Update password in database (replace with your database logic)
  user.password = newPassword;
  user.passwordChangedAt = Date.now(); // Update password changed timestamp
  await user.save();

  res.status(200).json({
    success: true,
    message: "Password updated successfully",
  });
};


export const getMe = async(req, res,next)=>{
  req.params.id = req.user._id;
  next();
}
export const updatedLoggedUserPass = async(req, res,next)=>{
  req.params.id = req.user._id;
  next();
}
export const updatedLoggedUser = async(req, res,next)=>{
  req.params.id = req.user._id;
  // console.log(req.params.id);
  // console.log(req.user._id);
  next();
}

export const deActivateAccount = async(req,res,next)=>{
  await User.findByIdAndUpdate(
    req.user._id, {active: false}, {
    new: true,})
    return res.status(204).json()
}