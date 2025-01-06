import { PORT } from "./config";
import bodyParser from "body-parser";
import { checkToken } from "./utils/checkToken";
import cors from "cors";
import error from "./utils/error";
import express from "express";
import jwtAuth from "./utils/userJwt";
import redis from "ioredis";
import { responseFormatter } from "./utils/response";
import routerList from "./router";

const init = async () => {
  const redisClient = new redis({
    port: 6379, // redis的端口
    host: "localhost", // redis的允许地址
    password: "", // redis的密码
    db: 0, // redis由16个db库，可以手动选择第几个，由0开始
  });

  // 监听错误信息
  redisClient.on("err", (err) => {
    console.log("redis client error: ", err);
  });
  const app = express();
  app.use((req: any, res: any, next: any) => {
    res.redis = redisClient;
    next();
  });
  //jwt
  app.use(jwtAuth);
  app.use(checkToken);
  app.use(responseFormatter);
  // 解析application/x-www-form-urlencoded数据格式
  app.use(bodyParser.urlencoded({ extended: true }));

  // 解析json数据格式
  app.use(bodyParser.json());

  //解析 text/plain 数据格式
  app.use(bodyParser.text());
  app.use(cors());
  app.use(express.json());
  app.use(express.static("public"));
  //解析表单数据:application/x-www-form-urlencoded
  app.use(express.urlencoded({ extended: false }));
  for (let i in routerList) {
    app.use("/api", (routerList as any)[i]);
  }
  app.use(error);
  app.listen(PORT, () => {
    console.log("start 3007");
  });
};

init();
