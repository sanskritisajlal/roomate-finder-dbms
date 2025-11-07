import express from "express";
import { authenticate } from "../middleware/authMiddleware.js";
import {
  createRequest,
  getReceivedRequests,
  getMyRequests,
  acceptRequest,
  rejectRequest,
  cancelRequest,
} from "../controllers/requestController.js";

const router = express.Router();

// Send request for a listing
router.post("/:listingId/request", authenticate, createRequest);

// Get all requests I have received (for my listings)
router.get("/received", authenticate, getReceivedRequests);

// Get all requests I have SENT
router.get("/mine", authenticate, getMyRequests);

// Accept / Reject / Cancel
router.post("/:requestId/accept", authenticate, acceptRequest);
router.post("/:requestId/reject", authenticate, rejectRequest);
router.post("/:listingId/request", authenticate, createRequest);
router.delete("/:requestId/cancel", authenticate, cancelRequest);

export default router;
