import express from "express";
import { createAuction, getActiveAuctions, getAuctionById, getClosedAuctions, getMyAuctions, getUpcomingAuctions } from "../controllers/auction.controller.js";
import { verifyToken } from "../middlewares/verifyToken.js";
const router=express.Router();

router.post("/create",verifyToken,createAuction);
router.get("/active",getActiveAuctions);
router.get("/upcoming",getUpcomingAuctions);
router.get("/closed",getClosedAuctions);
router.get("/mine",verifyToken,getMyAuctions);
router.get("/:id",getAuctionById);

export default router;