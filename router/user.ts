import { login, logout, regUser } from "../router_handle/user";

import express from "express";

const router = express.Router();
router.post("/reguser", regUser);
router.post("/login", login);
router.post("/logout", logout);
export default router;
