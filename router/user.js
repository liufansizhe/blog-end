/**
 * @Author: liuyue.lfsz liufansizhe@come-future.com
 * @Date: 2024-04-07 10:11:03
 * @LastEditors: liuyue.lfsz liufansizhe@come-future.com
 * @LastEditTime: 2024-04-07 15:03:19
 * @FilePath: /shiny-system/node/router/user.js
 * @Description:
 **/
import express from "express";
import { regUser, login } from "../router_handle/user.js";
const router = express.Router();
router.post("/reguser", regUser);
router.get("/login", login);
export default router;
