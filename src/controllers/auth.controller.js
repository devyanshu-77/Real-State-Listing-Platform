import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import AppError from "../utils/appError.js";
import userModel from "../models/user.model.js";
import listingModel from "../models/listing.model.js";
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
async function updateUser(req, res) {
  const updates = {};
  for (const key in req.body) {
    if (!updates[key] && req.body[key]) {
      if (key == "password") {
        const saltRounds = Number(process.env.SALT_ROUNDS);
        const hashedPass = await bcrypt.hash(req.body[key], saltRounds);
        updates[key] = hashedPass;
        continue;
      }
      updates[key] = req.body[key];
    }
  }
  const updatedUser = await userModel.findOneAndUpdate(
    { _id: req.user.id },
    updates,
    { returnDocument: "after" },
  );
  if (!updateUser) {
    return ApiResponse.error(res, "User does not exist", null, 404);
  }
  ApiResponse.success(
    res,
    "Updated user successfully",
    {
      id: updatedUser._id,
      role: updatedUser.role,
      email: updatedUser.email,
      username: updatedUser.username,
    },
    200,
  );
}
async function logoutController(req, res) {
  res.clearCookie("token");
  ApiResponse.success(res, "User logged out successfully", null, 200);
}
async function deleteUser(req, res) {
  await userModel.findByIdAndDelete(req.user.id);
  await listingModel.deleteMany({ propertyOwner: req.user.id });
  ApiResponse.success(res, "User delete successfully", null, 200);
}
async function getUser(req, res) {
  const user = await userModel.findById(req.user.id);
  if (!user) {
    res.clearCookie("token");
    return ApiResponse.error(res, "User does not exist", null, 400);
  }
  ApiResponse.success(
    res,
    "Found user",
    {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
    },
    200,
  );
}

export {
  registerController,
  loginController,
  logoutController,
  updateUser,
  deleteUser,
  getUser,
};
