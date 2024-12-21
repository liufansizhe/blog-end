import {
  getPublicKey,
  getUserInfo,
  login,
  logout,
  register,
} from "../router_handle/user";

import express from "express";

const router = express.Router();
router.get("/getPublicKey", getPublicKey);
router.post("/login", login);
router.post("/logout", logout);
router.post("/register", register);
router.get("/getUserInfo", getUserInfo);

export default router;
