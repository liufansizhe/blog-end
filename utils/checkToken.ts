//校验是否退出登录

import { NO_TOKEN_REQUEST } from "../config";

export const checkToken = async (req: any, res: any, next: any) => {
  if (NO_TOKEN_REQUEST.includes(req.path)) {
    next();
  } else {
    const { id } = req?.auth ?? {};
    if (await res.redis.get(id)) {
      next();
    } else {
      res.status(401).send({ success: false, data: null, message: "登录过期" });
    }
  }
};
