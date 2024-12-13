import express from "express";
import userRouter from "./router/user.js";
import { responseFormatter } from "./utils/response.js";
import cors from "cors";

const init = async () => {
  const app = express();
  //跨域配置
  app.use(responseFormatter);

  app.use(cors());
  app.use(express.json());
  app.use(express.static("public"));
  //解析表单数据:application/x-www-form-urlencoded
  app.use(express.urlencoded({ extended: false }));
  app.use("/api", userRouter);
  app.listen(3007, () => {
    console.log("lfsz", "start 3007");
  });
};

init();
