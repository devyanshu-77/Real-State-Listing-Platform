import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import AppError from "../utils/appError.js";
import userModel from "../models/user.model.js";
import ApiResponse from "../utils/ApiResponse.js";

const JWT_SECRET = process.env.JWT_SECRET;

async function registerController(req, res) {
  const { username, email, password, role, bio, phone } = req.body;
  const existingUser = await userModel.findOne({
    $or: [{ username }, { email }],
  });
  if (existingUser && existingUser.email == email) {
    throw new AppError("The email is already registered. Log in instead?", 409);
  } else if (existingUser && existingUser.username == username) {
    throw new AppError(
      "The username is already registered. Log in instead?",
      409,
    );
  }
  const saltRounds = Number(process.env.SALT_ROUNDS);
  const hashedPass = await bcrypt.hash(password, saltRounds);
  const user = await userModel.create({
    username,
    email,
    password: hashedPass,
    role,
    bio,
    phone,
  });
  const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET);
  res.cookie("token", token);

  const data = {
    username: user.username,
    email: user.email,
    role: user.role,
    bio: user.bio,
    phone: user.phone,
    id: user._id,
  };
  ApiResponse.success(res, "Registration successful!", data, 201);
}

async function loginController(req, res) {
  const { username, email, password } = req.body;
  const user = await userModel.findOne({
    $or: [{ username }, { email }],
  });
  const resMessage = {
    username: "Invalid username or password",
    email: "Invalid email or password",
  };
  if (!user) {
    throw new AppError(username ? resMessage.username : resMessage.email, 401);
  }

  const compareResult = await bcrypt.compare(password, user.password);
  if (!compareResult) {
    throw new AppError(username ? resMessage.username : resMessage.email, 401);
  }
  const token = jwt.sign(
    {
      role: user.role,
      id: user._id,
    },
    JWT_SECRET,
  );
  res.cookie("token", token);

  const data = {
    username: user.username,
    email: user.email,
    role: user.role,
    bio: user.bio,
    phone: user.phone,
    id: user._id,
  };
  ApiResponse.success(res, "Login successful", data, 200);
}

export { registerController, loginController };
