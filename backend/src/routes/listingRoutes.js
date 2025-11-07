import express from "express";
import { authenticate } from "../middleware/authMiddleware.js";
import {
  getAllListings,
  createListing,
  getMyListings,
  deleteListing,
  updateListing,   // ✅ add this import
} from "../controllers/listingController.js";

const router = express.Router();

router.get("/", authenticate, getAllListings);
router.post("/", authenticate, createListing);
router.get("/mine", authenticate, getMyListings);
router.put("/:listingId", authenticate, updateListing);  // ✅ add this line
router.delete("/:id", authenticate, deleteListing);

export default router;
