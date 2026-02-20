import express from "express";
import { getUser, updateUser, getAllUsers, deleteUser } from "../controllers/user.controller.js";
import { verifyToken, verifyAdmin } from "../middleware/jwt.js";

const router = express.Router();

router.get("/", verifyAdmin, getAllUsers);
router.get("/:id", getUser);
router.put("/:id", verifyToken, updateUser);
router.delete("/:id", verifyToken, deleteUser);

export default router;
