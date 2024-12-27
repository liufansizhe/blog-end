//jwt token校验

import { NO_TOKEN_REQUEST } from "../config";
import { getPrivateKeyPem } from "./encode";
import { expressjwt as jwt } from "express-jwt";

const secret = getPrivateKeyPem();

// 验证token是否过期
const jwtAuth = jwt({
  secret, //密匙
  algorithms: ["RS256"], //签名算法
}).unless({ path: NO_TOKEN_REQUEST }); // unless 设置jwt认证白名单
export default jwtAuth;
