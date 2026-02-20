import express from "express";
import { intent, confirm, getOrders, updateOrderStatus } from "../controllers/order.controller.js";
import { verifyToken } from "../middleware/jwt.js";

const router = express.Router();

router.get("/", verifyToken, getOrders);
router.post("/create-payment-intent/:id", verifyToken, intent);
router.put("/confirm", verifyToken, confirm);
router.put("/status/:id", verifyToken, updateOrderStatus);

export default router;
