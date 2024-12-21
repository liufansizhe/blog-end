import { getPrivateKeyPem } from "./encode";
import { expressjwt as jwt } from "express-jwt";

const secret = getPrivateKeyPem();

// 验证token是否过期
const jwtAuth = jwt({
  secret, //密匙
  algorithms: ["RS256"], //签名算法
}).unless({ path: ["/api/login", "/api/register", "/api/getPublicKey"] }); // unless 设置jwt认证白名单
export default jwtAuth;
