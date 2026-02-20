import User from "../models/user.model.js";
import { createError } from "../utils/createError.js";

export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return next(createError(404, "User not found!"));
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    if (req.params.id !== req.userId) return next(createError(403, "You can only update your profile!"));
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    ).select("-password");
    res.status(200).json(updatedUser);
  } catch (err) {
    next(err);
  }
};

export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (err) {
    next(err);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    if (req.params.id !== req.userId && !req.isAdmin)
      return next(createError(403, "Not authorized!"));
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "User deleted!" });
  } catch (err) {
    next(err);
  }
};
