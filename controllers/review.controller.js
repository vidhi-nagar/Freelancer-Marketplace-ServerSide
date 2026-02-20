import Review from "../models/review.model.js";
import Gig from "../models/gig.model.js";
import Order from "../models/order.model.js";
import { createError } from "../utils/createError.js";

export const createReview = async (req, res, next) => {
  if (req.isSeller) return next(createError(403, "Sellers cannot create reviews!"));

  try {
    // Check if user has ordered this gig
    const order = await Order.findOne({
      gigId: req.body.gigId,
      buyerId: req.userId,
      isCompleted: true,
    });
    if (!order) return next(createError(403, "You must purchase this gig before reviewing!"));

    // Check if already reviewed
    const existingReview = await Review.findOne({ gigId: req.body.gigId, userId: req.userId });
    if (existingReview) return next(createError(403, "You have already reviewed this gig!"));

    const newReview = new Review({ userId: req.userId, ...req.body });
    const savedReview = await newReview.save();

    await Gig.findByIdAndUpdate(req.body.gigId, {
      $inc: { totalStars: req.body.star, starNumber: 1 },
    });

    res.status(201).json(savedReview);
  } catch (err) {
    next(err);
  }
};

export const getReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ gigId: req.params.gigId }).populate("userId", "username profilePic");
    res.status(200).json(reviews);
  } catch (err) {
    next(err);
  }
};

export const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return next(createError(404, "Review not found!"));
    if (review.userId.toString() !== req.userId) return next(createError(403, "Not authorized!"));

    await Review.findByIdAndDelete(req.params.id);
    await Gig.findByIdAndUpdate(review.gigId, {
      $inc: { totalStars: -review.star, starNumber: -1 },
    });

    res.status(200).json({ message: "Review deleted!" });
  } catch (err) {
    next(err);
  }
};
