import {
  getPublicKey,
  getUserInfo,
  login,
  logout,
  register,
  setUserInfo,
} from "../router_handle/user";

import express from "express";

const router = express.Router();
router.get("/getPublicKey", getPublicKey);
router.post("/login", login);
router.post("/logout", logout);
router.post("/register", register);
router.get("/getUserInfo", getUserInfo);
router.post("/setUserInfo", setUserInfo);
export default router;
