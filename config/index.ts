//不需要token的接口
export const NO_TOKEN_REQUEST = [
  "/api/login",
  "/api/register",
  "/api/getPublicKey",
  "/api/test",
];
//token过期时间
export const TOKEN_TIME = 3600 * 24;
