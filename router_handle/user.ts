import db from "../db/index";
import jwt from "jsonwebtoken";

export const login = async (req: any, res: any, next: any) => {
  let { username } = req.body;

  // 登录成功，签发一个token并返回给前端
  const token = jwt.sign(
    // payload：签发的 token 里面要包含的一些数据
    { username },
    // 私钥
    "lfsz",
    // 设置过期时间
    { expiresIn: 10 } //1 day
  );

  res.sendResponse({
    message: "登录成功",
    data: { token },
  });
};
export const regUser = (req: any, res: any) => {
  console.log("lfsz3", req.body.a);

  res.sendResponse("reguser");
};

export const logout = (req: any, res: any) => {
  let { username } = req.body;

  // 登录成功，签发一个token并返回给前端
  const token = jwt.sign(
    // payload：签发的 token 里面要包含的一些数据
    { username },
    // 私钥
    "lfsz",
    // 设置过期时间
    { expiresIn: 0 } //1 day
  );

  res.sendResponse({
    message: "登出成功",
  });
};
