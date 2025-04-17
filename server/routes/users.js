import express from "express";
import {
  getUser,
  getUserFriends,
  addRemoveFriend,
  getUserByName,
  increaseViews,
} from "../controllers/users.js";
import { verifyToken } from "../middleware/auth.js";

const router = express.Router();

/* READ */
router.get("/:id", verifyToken, getUser);
router.get("/:id/friends", verifyToken, getUserFriends);
router.get("/search/:userName",verifyToken,getUserByName)

/* UPDATE */
router.patch("/:id/profile-views",verifyToken,increaseViews);
router.patch("/:id/:friendId", verifyToken, addRemoveFriend);

export default router;