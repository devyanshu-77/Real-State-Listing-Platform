import userModel from "../models/user.model.js";
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

  const user = await userModel.create({
    username,
    email,
    password,
    role,
    bio,
    phone,
  });

  res.status(201).json({
    success: true,
    message: "Registered new user",
    data: [
      {
        username,
        email,
        role,
        bio,
        phone,
        id: user._id,
      },
    ],
  });
}

export { registerController };
