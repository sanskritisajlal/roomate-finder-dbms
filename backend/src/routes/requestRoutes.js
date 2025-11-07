import express from "express";
import { authenticate } from "../middleware/authMiddleware.js";
import { createRequest, getReceivedRequests, acceptRequest, rejectRequest, cancelRequest } from "../controllers/requestController.js";

const router = express.Router();
router.post("/:listingId/request", authenticate, createRequest);
router.get("/received", authenticate, getReceivedRequests);
router.post("/:requestId/accept", authenticate, acceptRequest);
router.post("/:requestId/reject", authenticate, rejectRequest);
router.delete("/:requestId/cancel", authenticate, cancelRequest);
export default router;
