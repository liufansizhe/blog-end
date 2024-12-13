import db from "../db/index.js";

export const login = async (req, res, next) => {
  const data = await db.deleteMany("users");
  res.sendResponse(data);
};
export const regUser = (req, res) => {
  res.sendResponse("reguser");
};
