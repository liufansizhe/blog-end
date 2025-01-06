import nodemailer from "nodemailer";

export const mailConfig = {
  pass: "uzxxxtnpbguwbfaf",
  user: "651828515@qq.com",
}; // 初始化邮件服务
export const transport = nodemailer.createTransport({
  service: "qq",
  host: "smtp.qq.com",
  port: 465,
  secure: true, //是否要使用https
  auth: {
    user: mailConfig.user, //邮箱账号
    pass: mailConfig.pass, //邮箱密码/授权码
  },
});
