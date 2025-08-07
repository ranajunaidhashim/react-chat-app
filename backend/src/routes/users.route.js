import express from "express";
import User from "../models/User.js";
import {verifyJwt} from "../middlewares/auth.js";

const router = express.Router();

router.get("/", verifyJwt, async (req, res) => {
  const all = await User.find({}, "_id username");
  // optional: filter out yourself
  const others = all.filter(u => u._id.toString() !== req.user.userId);
  res.json(others);
});

export default router;
