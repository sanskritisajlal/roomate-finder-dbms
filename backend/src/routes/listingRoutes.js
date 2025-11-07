import express from "express";
import { authenticate } from "../middleware/authMiddleware.js";
import {
  getAllListings,
  createListing,
  getMyListings,
  deleteListing,
} from "../controllers/listingController.js";

const router = express.Router();

router.get("/", authenticate, getAllListings);
router.post("/", authenticate, createListing);
router.get("/mine", authenticate, getMyListings);
router.delete("/:id", authenticate, deleteListing);

export default router;
