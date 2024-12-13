export const responseFormatter = (req, res, next) => {
  res.sendResponse = (data) => {
    // 格式化响应数据
    let responseData = {
      success: true,
      data: data,
    };
    // 如果data是Error类型，则认为是失败的响应
    if (data instanceof Error) {
      responseData = {
        success: false,
        error: {
          message: data?.message,
        },
      };
    }
    res.send(responseData);
  };
  next();
};
