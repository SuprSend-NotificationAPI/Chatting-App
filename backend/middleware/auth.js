import jwt from "jsonwebtoken";
import User from "../models/user.js";

const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer")) {
    // throw new Error("Authentication Invalid");
    return res.status(401).send("Authentication Invalid 1");
  }
  let token = authHeader.split(" ")[1];
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(payload.id).select("-password");
    // req.user = { id: payload.userId };

    next();
  } catch (error) {
    return res.status(401).send("Authentication Invalid 2");
    // throw new Error("Authentication Invalid");
  }
};

export default auth;