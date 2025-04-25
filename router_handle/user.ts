import { CODE_TIME, PORT, TOKEN_TIME } from "../config";
import {
  getPrivateKeyPem,
  getPubKeyPem,
  privateDecrypt,
} from "../utils/encode";
import { loginSchema, registerSchema } from "../utils/validate";
import { mailConfig, transport } from "../utils/email";

import bcrypt from "bcryptjs";
import db from "../db/index";
import jwt from "jsonwebtoken";
import uuid from "node-uuid";

const secret = getPrivateKeyPem();
//登录
export const login = async (req: any, res: any, next: any) => {
  const validData = await res.valid(loginSchema);
  if (!validData) {
    return;
  }

  const { email, password } = req.body;
  const data = (await (await db.find("users", { email }))?.toArray()) ?? [];
  if (data?.length > 0) {
    if (bcrypt.compareSync(privateDecrypt(password), data?.[0]?.password)) {
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
  const validData = await res.valid(registerSchema);
  if (!validData) {
    return;
  }
  const { email, password, code } = req.body;
  const redisCode = await res.redis.get(email);
  if (redisCode) {
    if (redisCode !== code) {
      res.sendResponse({
        message: "验证码错误",
        success: false,
      });
      return;
    }
  } else {
    res.sendResponse({
      message: "验证码已过期",
      success: false,
    });
    return;
  }
  const data = (await (await db.find("users", { email }))?.toArray()) ?? [];
  if (data?.length > 0) {
    res.sendResponse({
      message: "用户已存在",
      success: false,
    });
  } else {
    const data = await db.insert("users", {
      id: uuid.v1(),
      email,
      password: bcrypt.hashSync(privateDecrypt(password), 10),
      avatar: "http://" + req.host + ":" + PORT + "/avatar.png",
      nickName: email,
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
  const { nickName, bio } = req.body;
  const data = await db.update(
    "users",
    {
      id: req?.auth?.id,
    },
    { $set: { nickName, bio } }
  );
  if (data) {
    res.sendResponse({ message: "更新成功" });
  } else {
    res.sendResponse({ success: false, message: "获取用户信息失败" });
  }
};

//获取验证码
export const getCode = async (req: any, res: any) => {
  let { email } = req?.query;
  const code = String(Math.floor(Math.random() * 1000000)).padEnd(6, "0");
  res.redis.set(email, code);
  res.redis.expire(email, CODE_TIME);
  try {
    await transport.sendMail({
      to: email,
      from: mailConfig.user,
      subject: "登录验证码",
      text: code,
    });
    res.sendResponse({ message: "验证码已发送" });
  } catch (e) {
    console.log("lfsz", e);

    res.sendResponse({ message: "验证码发送失败", success: false });
  }
};
//保存简介
export const saveCv = async (req: any, res: any) => {
  const data = req.body;
  let result = null;
  const info =
    (await (await db.find("cv", { id: req?.auth?.id }))?.toArray()) ?? [];
  if (info.length > 0) {
    result = await db.update(
      "cv",
      {
        id: req?.auth?.id,
      },
      { $set: data }
    );
  } else {
    result = await db.insert("cv", {
      id: req?.auth?.id,
      ...data,
    });
  }
  if (result) {
    res.sendResponse({ message: "保存成功" });
  } else {
    res.sendResponse({ success: false, message: "保存用户信息失败" });
  }
};
//获取简介
export const getCv = async (req: any, res: any) => {};
