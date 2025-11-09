// backend/src/routes/requestRoutes.js
import express from "express";
import { authenticate } from "../middleware/authMiddleware.js";
import {
  createRequest,
  getMyRequests,
  getReceivedRequests,
  acceptRequest,
  rejectRequest,
  cancelRequest
} from "../controllers/requestController.js";

const router = express.Router();

// Send request to a listing
router.post("/:listingId/request", authenticate, createRequest);

// My requests (sent)
router.get("/mine", authenticate, getMyRequests);

// Requests I received (as listing owner)
router.get("/received", authenticate, getReceivedRequests);

// Accept, reject, cancel
router.post("/:requestId/accept", authenticate, acceptRequest);
router.post("/:requestId/reject", authenticate, rejectRequest);
router.delete("/:requestId/cancel", authenticate, cancelRequest);

export default router;
