import { ArticleListType, ArticleType } from "./types";
import { articleListSchema, publishSchema } from "../utils/validate";

import db from "../db/index";
import uuid from "node-uuid";

//发布文章
export const publishArticle = async (req: any, res: any) => {
  const validData = await res.valid(publishSchema);
  if (!validData) {
    return;
  }
  const { title, content, describe } = req.body;

  const data = await db.insert("articles", {
    id: uuid.v1(),
    title,
    content,
    describe,
    collect: 0,
    praise: 0,
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
  const validData = await res.valid(articleListSchema);
  if (!validData) {
    return;
  }
  const { pageSize = 10, pageIndex = 1 } = req.query ?? {};
  const skipNum = (Number(pageIndex) - 1) * Number(pageSize);

  const totalNum = await db.getDocumentsNum("articles");

  const data: ArticleType[] =
    ((await (await db.find("articles"))
      ?.sort({ createTime: -1 })
      ?.skip(skipNum)
      ?.limit(Number(pageSize))
      ?.toArray()) as any[]) ?? [];

  let responseData: ArticleListType[] = [];
  const promiseList = [];
  responseData = new Array(data.length);
  for (let i = 0; i < data.length; i++) {
    const fn = async (val: ArticleType) => {
      const userInfo = await (
        await db.find("users", { id: val?.userId })
      )?.toArray();
      responseData[i] = {
        title: val?.title,
        userAvatar: userInfo?.[0]?.avatar,
        userName: userInfo?.[0]?.nickName,
        contentId: val?.id,
        createTime: val?.createTime,
        describe: val?.describe,
        praise: val?.praise,
        collect: val?.collect,
      };
    };
    promiseList.push(fn(data[i]));
  }
  await Promise.all(promiseList);

  if (data) {
    res.sendResponse({
      data: {
        list: responseData,
        total: totalNum,
      },
      message: "获取成功",
    });
  } else {
    res.sendResponse({
      message: "获取失败",
      success: false,
    });
  }
};
