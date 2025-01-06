//不需要token的接口
export const NO_TOKEN_REQUEST = [
  "/api/login",
  "/api/register",
  "/api/getPublicKey",
  "/api/test",
  "/avatar.png",
  "/api/getCode",
  "/api/getHomeArticleList",
];
//token过期时间
export const TOKEN_TIME = 3600 * 24;

//端口
export const PORT = 3007;

//验证码过期时间
export const CODE_TIME = 60;
