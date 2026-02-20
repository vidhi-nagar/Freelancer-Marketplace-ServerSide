import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { createError } from "../utils/createError.js";

export const register = async (req, res, next) => {
  try {
    const { username, email, password, isSeller, fullName, country, phone, desc } = req.body;

    // Check existing user
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) return next(createError(400, "User already exists!"));

    const hash = bcrypt.hashSync(password, 10);
    const newUser = new User({
      username,
      email,
      password: hash,
      isSeller: isSeller || false,
      fullName: fullName || "",
      country: country || "",
      phone: phone || "",
      desc: desc || "",
    });

    await newUser.save();
    res.status(201).json({ message: "User registered successfully!" });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) return next(createError(404, "User not found!"));

    const isCorrect = bcrypt.compareSync(password, user.password);
    if (!isCorrect) return next(createError(400, "Wrong password or username!"));

    const token = jwt.sign(
      { id: user._id, isSeller: user.isSeller, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || "7d" }
    );

    const { password: userPassword, ...info } = user._doc;
    res
      .cookie("accessToken", token, { httpOnly: true })
      .status(200)
      .json({ ...info, token });
  } catch (err) {
    next(err);
  }
};

export const logout = async (req, res) => {
  res.clearCookie("accessToken", { sameSite: "none", secure: true })
    .status(200)
    .json({ message: "Logged out successfully!" });
};
