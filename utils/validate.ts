import joi from "joi";

const CodePass = joi.string();
//密码校验
const PasswordPass = joi.string();
//昵称校验
const NickNamePass = joi.string().min(8).max(16).required();
//邮箱校验
const EmailPass = joi
  .string()
  .pattern(
    new RegExp(
      "^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(.[a-zA-Z0-9-]+)*.[a-zA-Z0-9]{2,6}$"
    )
  )
  .required();
//账号校验
const AccountPass = joi.string().min(4).max(16);

export const loginSchema = joi.object({
  email: EmailPass.required(),
  password: PasswordPass.required(),
});
export const registerSchema = joi.object({
  email: EmailPass.required(),
  password: PasswordPass.required(),
  code: CodePass.required(),
});

export const publishSchema = joi.object({
  title: joi.string().required(),
  content: joi.string().required(),
});
