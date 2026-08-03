import bcrypt from "bcryptjs";
import userModel from "../models/user.model.js";
import listingModel from "../models/listing.model.js";
import ApiResponse from "../utils/ApiResponse.js";

async function registerAdmin(req, res) {
  if (req.user.role !== "admin") {
    return ApiResponse.error(res, "Unauthorized", null, 400);
  }
  const { username, email, password, role } = req.body;
  const isAdminExist = await userModel.findOne({
    $or: [{ email }, { username }],
  });
  if (isAdminExist && isAdminExist.email == email) {
    return ApiResponse.error(
      res,
      "Admin already exist with given email. Login instead ?",
      null,
      400,
    );
  } else if (isAdminExist && isAdminExist.username) {
    return ApiResponse.error(
      res,
      "Admin already exist with given username. Login instead ?",
      null,
      400,
    );
  }
  const SALT_ROUNDS = Number(process.env.SALT_ROUNDS);
  const hashedPass = await bcrypt.hash(password, SALT_ROUNDS);
  const admin = await userModel.create({
    username,
    email,
    password: hashedPass,
    role,
  });

  ApiResponse.success(
    res,
    "Admin registered successfully",
    {
      id: admin._id,
      username: admin.username,
      emal: admin.email,
      role: admin.role,
    },
    201,
  );
}
async function deleteListing(req, res) {
  if ("admin" !== req.user.role) {
    return ApiResponse.error(
      res,
      "Unauthorized only admins and property owners can delte listings",
      null,
      400,
    );
  }
  const listingId = req.params.listingId;
  if (!listingId) {
    return ApiResponse.error(res, "Please provide a listing id", null, 400);
  }

  const deletedListing = await listingModel.findByIdAndDelete(req.user.id);
  ApiResponse.success(
    res,
    "Deleted listing successfully",
    { deletedListing },
    200,
  );
}

export { registerAdmin, deleteListing };
