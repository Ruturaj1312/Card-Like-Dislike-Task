import express from "express";
import { loginUser, registerUser } from "../controllers/user.controller.js";

const router = express.Router();

router.route("/register_User").post(registerUser);
router.route("/login_User").post(loginUser);

export default router;
