import cnMessages from "joi-messages-zh_cn";

const cnMessage = cnMessages["zh-cn"];
//接口返回规范
export const responseFormatter = (req: any, res: any, next: any) => {
  res.sendResponse = (data: any) => {
    // 格式化响应数据
    let responseData = {
      success: data?.success ?? true,
      data: data?.data ?? null,
      message: data?.message ?? "",
    };
    // 如果data是Error类型，则认为是失败的响应
    if (data instanceof Error) {
      responseData = {
        success: false,
        data: null,
        message: data?.message,
      };
    }
    res.status(data?.status ?? 200).send(responseData);
  };
  res.valid = async (schema: any) => {
    let params = null;
    switch (req.method) {
      case "POST": {
        params = req.body;
        break;
      }
      case "GET": {
        params = req.query;
        break;
      }
    }
    const { value, error } = await schema.validate(params, {
      messages: { ...cnMessage },
    });
    if (error) {
      res
        .status(500)
        .send({ success: false, data: null, message: error.message });
      return null;
    }

    return value;
  };
  next();
};
