import User from "../models/user.model.js";
import Order from "../models/order.model.js";
import Gig from "../models/gig.model.js";
import Stripe from "stripe";
import { createError } from "../utils/createError.js";

// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
//   apiVersion: "2023-10-16",
// });

// controllers/order.controller.js

export const intent = async (req, res, next) => {
  try {
    const currentUserId = req.userId; // token se aata hai

    const gig = await Gig.findById(req.params.id);

    const newOrder = new Order({
      gigId: gig._id,
      img: gig.cover,
      title: gig.title,
      price: gig.price,

      sellerId: gig.userId, // 👈 seller = gig ka owner
      buyerId: currentUserId, // 👈 buyer = jo login hai

      isCompleted: false,
      payment_intent: "temporary",
    });

    const savedOrder = await newOrder.save();
    res.status(200).json(savedOrder);
  } catch (err) {
    next(err);
  }
};

export const confirm = async (req, res, next) => {
  try {
    const order = await Order.findOneAndUpdate(
      { payment_intent: req.body.payment_intent },
      {
        $set: {
          status: "in_progress",
        },
      },
      { new: true },
    );

    if (!order) return next(createError(404, "Order not found!"));

    res.status(200).json({ message: "Order started!", order });
  } catch (err) {
    next(err);
  }
};

export const getOrders = async (req, res, next) => {
  try {
    const currentUser = await User.findById(req.userId);

    // const orders = await Order.find({
    //   ...(req.isSeller ? { sellerId: req.userId } : { buyerId: req.userId }),
    //   isCompleted: true,
    // });

    let orders;

    if (currentUser.isSeller) {
      // seller ke liye
      orders = await Order.find({
        sellerId: currentUser._id,
        isCompleted: true,
      });
    } else {
      // buyer ke liye
      orders = await Order.find({
        buyerId: currentUser._id,
        isCompleted: true,
      });
    }

    res.status(200).json(orders);
  } catch (err) {
    next(err);
  }
};

export const updateOrderStatus = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return next(createError(404, "Order not found!"));

    if (order.sellerId !== req.userId && order.buyerId !== req.userId)
      return next(createError(403, "Not authorized!"));

    let updateData = { status: req.body.status };

    if (req.body.status === "completed") {
      await Gig.findByIdAndUpdate(order.gigId, {
        $inc: { sales: 1 },
      });

      updateData.isCompleted = true;
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true },
    );

    res.status(200).json(updatedOrder);
  } catch (err) {
    next(err);
  }
};
