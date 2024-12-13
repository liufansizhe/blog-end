import bodyParser from "body-parser";
import cors from "cors";
import error from "./utils/error";
import express from "express";
import jwtAuth from "./utils/userJwt";
import { responseFormatter } from "./utils/response";
import userRouter from "./router/user";

const init = async () => {
  const app = express();
  //jwt
  app.use(jwtAuth);
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
  app.use("/api", userRouter);
  app.use(error);
  app.listen(3007, () => {
    console.log("start 3007");
  });
};

init();
