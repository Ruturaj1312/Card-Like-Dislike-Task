import express from "express";
import authMiddleware from "../middleware/auth.Middleware.js";
import {
  createCard,
  dislikeCard,
  getAllCards,
  getRecommendedCards,
  likeCard,
} from "../controllers/card.controller.js";
import upload from "../middleware/multer.middleware.js";

const router = express.Router();

router.route("/get_All_Cards").get(authMiddleware, getAllCards);
router.route("/create_card").post(upload.single("image"), createCard);
router.route("/like_card/:id/like").post(authMiddleware, likeCard);
router.route("/dislike_card/:id/dislike").post(authMiddleware, dislikeCard);
router.route("/get_RecommendedCards").get(authMiddleware, getRecommendedCards);

export default router;
