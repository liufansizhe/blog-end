//错误捕获
export default (err: any, req: any, res: any, next: any) => {
  if (err && err.name === "UnauthorizedError") {
    const { status = 401, message } = err;
    // 抛出401异常
    res.status(status).json({
      message: "token失效，请重新登录",
      success: false,
      data: null,
    });
  } else {
    const { output } = err || {};
    // 错误码和错误信息
    const errCode = (output && output.statusCode) || 500;
    const errMsg =
      (output && output.payload && output.payload.error) || err.message;
    res.status(errCode).json({
      message: errMsg,
      data: null,
    });
  }
};
