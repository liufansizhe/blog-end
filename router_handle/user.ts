import {
  getPrivateKeyPem,
  getPubKeyPem,
  privateDecrypt,
} from "../utils/encode";

import db from "../db/index";
import jwt from "jsonwebtoken";

const secret = getPrivateKeyPem();
//登录
export const login = async (req: any, res: any, next: any) => {
  const { email, password } = req.body;
  const data =
    (await (await db.find("users", { email: email }))?.toArray()) ?? [];
  if (data?.length > 0) {
    if (privateDecrypt(data?.[0]?.password) == privateDecrypt(password)) {
      // 登录成功，签发一个token并返回给前端
      const token = jwt.sign(
        // payload：签发的 token 里面要包含的一些数据
        { email },
        // 私钥
        secret,
        // 设置过期时间
        { expiresIn: 10, algorithm: "RS256" }
      );
      res.sendResponse({
        message: "登录成功",
        data: { token },
      });
    } else {
      res.sendResponse({
        message: "用户名或者密码错误",
        success: false,
      });
    }
  } else {
    res.sendResponse({
      message: "用户名或者密码错误",
      success: false,
    });
  }
};
//获取公钥
export const getPublicKey = (req: any, res: any) => {
  res.set("Content-Type", "application/x-pem-file");
  const pub_key = getPubKeyPem();
  res.sendResponse({ data: { pub_key } });
};
//登出
export const logout = (req: any, res: any) => {
  let { email } = req.body;

  // 登录成功，签发一个token并返回给前端
  const token = jwt.sign(
    // payload：签发的 token 里面要包含的一些数据
    { email },
    // 私钥
    "lfsz",
    // 设置过期时间
    { expiresIn: 0 } //1 day
  );

  res.sendResponse({
    message: "登出成功",
  });
};
//注册
export const register = async (req: any, res: any) => {
  const { email, password } = req.body;
  const data =
    (await (await db.find("users", { email: email }))?.toArray()) ?? [];
  if (data?.length > 0) {
    res.sendResponse({
      message: "用户已存在",
      success: false,
    });
  } else {
    const data = await db.insert("users", {
      email,
      password,
    });
    if (data?.acknowledged) {
      res.sendResponse({
        message: "注册成功",
      });
    } else {
      res.sendResponse({
        message: "注册失败",
        success: false,
      });
    }
  }
};

//注册
export const getUserInfo = async (req: any, res: any) => {
  const data = await db.findOne("users", {
    email: req?.auth?.email,
  });
  if (data) {
    res.sendResponse({ data: { email: data?.email } });
  } else {
    res.sendResponse({ success: false, message: "获取用户信息失败" });
  }
};
