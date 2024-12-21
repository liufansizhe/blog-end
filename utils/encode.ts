// @ts-ignore

import JSEncrypt from "jsencrypt-node";
import crypto from "crypto";
import fs from "fs";
import path from "path";

// 生成新的RSA密钥对
const createKeys = () => {
  const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
    modulusLength: 2048,
  }); // 将公钥转换为PEM格式的字符串
  const publicKeyPem = publicKey
    .export({ type: "pkcs1", format: "pem" })
    .toString();
  const privateKeyPem = privateKey
    .export({ type: "pkcs1", format: "pem" })
    .toString();
  return { publicKeyPem, privateKeyPem };
};
// 写入公钥文件
const setPubKeyPem = (pubKey: string) => {
  const filepath = path.join(__dirname, "public.pem");
  fs.writeFileSync(filepath, pubKey);
};
// 读取公钥文件
export const getPubKeyPem = () => {
  const filepath = path.join(__dirname, "public.pem");
  let publicKey = "";
  if (fs.existsSync(filepath)) {
    publicKey = fs.readFileSync(filepath, "utf8");
  }
  if (!publicKey) {
    const { publicKeyPem, privateKeyPem } = createKeys();
    setPubKeyPem(publicKeyPem);
    setPrivateKeyPem(privateKeyPem);
    return publicKeyPem;
  }
  return publicKey;
};
// 写入私钥文件
const setPrivateKeyPem = (priKey: string) => {
  const filepath = path.join(__dirname, "private.pem");
  fs.writeFileSync(filepath, priKey);
};
// 读取私钥文件
export const getPrivateKeyPem = () => {
  const filepath = path.join(__dirname, "private.pem");
  let privateKey = "";
  if (fs.existsSync(filepath)) {
    privateKey = fs.readFileSync(filepath, "utf8");
  }
  if (!privateKey) {
    const { publicKeyPem, privateKeyPem } = createKeys();
    setPubKeyPem(publicKeyPem);
    setPrivateKeyPem(privateKeyPem);
    return privateKeyPem;
  }
  return privateKey;
};

//解密
export const privateDecrypt = (val: string) => {
  const encryptInstance = new JSEncrypt();
  const key = getPrivateKeyPem();
  encryptInstance.setPrivateKey(key);
  return JSON.parse(encryptInstance.decrypt(JSON.stringify(val)));
};
