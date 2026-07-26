import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import userModel from "../models/user.model.js";

const JWT_SECRET = process.env.JWT_SECRET;

async function registerController(req, res) {
  const { username, email, password, role, bio, phone } = req.body;
  const existingUser = await userModel.findOne({
    $or: [{ username }, { email }],
  });
  if (
    existingUser &&
    existingUser.email == email &&
    existingUser.username == username
  ) {
    return res.status(409).json({
      success: false,
      message: "user already registered with this username and email",
    });
  } else if (existingUser && existingUser.email == email) {
    return res.status(409).json({
      success: false,
      message: "Email already registered",
    });
  } else if (existingUser && existingUser.username == username) {
    return res.status(409).json({
      success: false,
      message: "Username already taken",
    });
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
  res.status(201).json({
    success: true,
    message: "Registered new user",
    data: [
      {
        username: user.username,
        email: user.email,
        bio: user.bio,
        phone: user.phone,
        id: user._id,
      },
    ],
  });
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
    return res.status(401).json({
      success: false,
      message: username ? resMessage.username : resMessage.email,
      errors: [],
    });
  }

  const compareResult = await bcrypt.compare(password, user.password);
  if (!compareResult) {
    return res.status(401).json({
      success: false,
      message: username ? resMessage.username : resMessage.email,
      errors: [],
    });
  }
  console.log(result);
  const token = jwt.sign(
    {
      role: user.role,
      id: user._id,
    },
    JWT_SECRET,
  );
  res.cookie("token", token);
  res.status(200).json({
    success: true,
    message: "User login successfully",
    data: [
      {
        username: user.username,
        email: user.email,
        phone: user.phone,
        id: user._id,
      },
    ],
  });
}

export { registerController, loginController };
