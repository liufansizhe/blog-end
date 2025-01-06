import {
  getCode,
  getUserInfo,
  login,
  logout,
  register,
  setUserInfo,
} from "../router_handle/user";

import express from "express";

const router = express.Router();
router.post("/login", login);
router.post("/logout", logout);
router.post("/register", register);
router.get("/getUserInfo", getUserInfo);
router.post("/setUserInfo", setUserInfo);
router.get("/getCode", getCode);
export default router;
