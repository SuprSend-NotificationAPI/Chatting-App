import jwt from "jsonwebtoken";
import User from "../models/user.js";
import bcrypt from "bcryptjs";

// import {
//   BadRequestError,
//   NotFoundError,
//   UnAuthenticatedError,
// } from "../errors/index.js";

const register = async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(404).json({ error: "Enter all the values" });
  }

  const isUserExists = await User.findOne({ email: email });

  if (isUserExists) {
    return res
      .status(404)
      .json({ error: "User with this email already exists" });
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashPassword,
  });

  const token = jwt.sign(
    {
      id: user._id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_LIFETIME,
    }
  );

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    token,
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Please Provide All the Values" });
  }

  const isUser = await User.findOne({ email: email });

  if (!isUser) {
    return res.status(400).json({ error: "Invalid credentials" });
  }

  const comparePassword = await bcrypt.compare(password, isUser.password);

  if (!comparePassword) {
    return res.status(400).json({ error: "Invalid credentials" });
  }

  const token = jwt.sign(
    {
      id: isUser._id,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_LIFETIME,
    }
  );

  res.status(200).json({
    success: true,
    _id: isUser._id,
    name: isUser.name,
    email: isUser.email,
    token,
  });
};

const searchUser = async (req, res) => {
  const { search } = req.query;

  const user = await User.find({
    name: { $regex: search, $options: "i" },
  }).select("name _id email");

  res.status(200).json(user);
};

export { register, login, searchUser };
