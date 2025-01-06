import { ArticleListType, ArticleType } from "./types";

import db from "../db/index";
import { publishSchema } from "../utils/validate";
import uuid from "node-uuid";

//发布文章
export const publishArticle = async (req: any, res: any) => {
  const validData = await res.valid(publishSchema);
  if (!validData) {
    return;
  }
  const { title, content } = req.body;

  const data = await db.insert("articles", {
    id: uuid.v1(),
    title,
    content,
    createTime: new Date().getTime(),
    userId: req.auth?.id,
  });
  if (data?.acknowledged) {
    res.sendResponse({
      message: "发布成功",
    });
  } else {
    res.sendResponse({
      message: "发布失败",
      success: false,
    });
  }
};

//首页获取文章列表
export const getHomeArticleList = async (req: any, res: any) => {
  const data: ArticleType[] =
    ((await (await db.find("articles"))
      ?.sort({ createTime: -1 })
      ?.toArray()) as any[]) ?? [];
  let responseData: ArticleListType[] = [];
  const promiseList = [];
  for (let i = 0; i < data.length; i++) {
    const fn = async (val: ArticleType) => {
      const userInfo = await (
        await db.find("users", { id: val?.userId })
      )?.toArray();
      responseData.push({
        title: val?.title,
        userAvatar: userInfo?.[0]?.avatar,
        userName: userInfo?.[0]?.nickName,
        contentId: val?.id,
      });
    };
    promiseList.push(fn(data[i]));
  }
  await Promise.all(promiseList);

  if (data) {
    res.sendResponse({
      data: responseData,
      message: "获取成功",
    });
  } else {
    res.sendResponse({
      message: "获取失败",
      success: false,
    });
  }
};
