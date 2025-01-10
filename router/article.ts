import {
  getArticleDetail,
  getHomeArticleList,
  publishArticle,
} from "../router_handle/article";

import express from "express";

const router = express.Router();
router.post("/publishArticle", publishArticle);
router.get("/getHomeArticleList", getHomeArticleList);
router.get("/getArticleDetail", getArticleDetail);

export default router;
