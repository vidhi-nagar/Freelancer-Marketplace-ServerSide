import express from "express";
import {
  createGig,
  deleteGig,
  updateGig,
  getGig,
  getGigs,
  getSellerGigs,
} from "../controllers/gig.controller.js";
import { verifyToken, verifySeller } from "../middleware/jwt.js";

const router = express.Router();

router.post("/", verifySeller, createGig);
router.delete("/:id", verifySeller, deleteGig);
router.put("/:id", verifySeller, updateGig);
router.get("/single/:id", getGig);
router.get("/", getGigs);
router.get("/seller/mygigs", verifySeller, getSellerGigs);

export default router;
