import {
  getPrivateKeyPem,
  getPubKeyPem,
  privateDecrypt,
} from "../utils/encode";

import { TOKEN_TIME } from "../config";
import db from "../db/index";
import jwt from "jsonwebtoken";
import uuid from "node-uuid";

const secret = getPrivateKeyPem();
//登录
export const login = async (req: any, res: any, next: any) => {
  const { account, password } = req.body;
  const data = (await (await db.find("users", { account }))?.toArray()) ?? [];
  if (data?.length > 0) {
    if (privateDecrypt(data?.[0]?.password) == privateDecrypt(password)) {
      const id = data?.[0]?.id;
      // 登录成功，签发一个token并返回给前端
      const token = jwt.sign(
        // payload：签发的 token 里面要包含的一些数据
        { id },
        // 私钥
        secret,
        // 设置过期时间
        { expiresIn: TOKEN_TIME, algorithm: "RS256" }
      );
      res.sendResponse({
        message: "登录成功",
        data: { token },
      });
      await res.redis.set(id, token);
      await res.redis.expire(id, TOKEN_TIME);
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
export const logout = async (req: any, res: any) => {
  let { id } = req?.auth;
  if (await res.redis.get(id)) {
    await res.redis.del(id);
  }
  res.sendResponse({
    message: "登出成功",
  });
};
//注册
export const register = async (req: any, res: any) => {
  const { account, password } = req.body;
  const data = (await (await db.find("users", { account }))?.toArray()) ?? [];
  if (data?.length > 0) {
    res.sendResponse({
      message: "用户已存在",
      success: false,
    });
  } else {
    const data = await db.insert("users", {
      id: uuid.v1(),
      account,
      password,
      avatar: "https://api.dicebear.com/7.x/miniavs/svg?seed=2",
      nickName: account,
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

//获取用户信息
export const getUserInfo = async (req: any, res: any) => {
  const data = await db.findOne("users", {
    id: req?.auth?.id,
  });
  if (data) {
    const { nickName, account, email, avatar, bio } = data ?? {};
    res.sendResponse({ data: { nickName, account, email, avatar, bio } });
  } else {
    res.sendResponse({ success: false, message: "获取用户信息失败" });
  }
};
//更新用户信息
export const setUserInfo = async (req: any, res: any) => {
  const { nickName, email, bio } = req.body;
  const data = await db.update(
    "users",
    {
      id: req?.auth?.id,
    },
    { $set: { nickName, email, bio } }
  );
  if (data) {
    res.sendResponse({ message: "更新成功" });
  } else {
    res.sendResponse({ success: false, message: "获取用户信息失败" });
  }
};
