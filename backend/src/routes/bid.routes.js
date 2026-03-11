import express from 'express';
import { placeBid } from '../controllers/bid.controller.js';
import { verifyToken } from '../middlewares/verifyToken.js';
const router = express.Router();

router.post("/create",verifyToken,placeBid);

export default router;