import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      required: function () {
        return !["admin"].includes(this.role);
      },
      unique: true,
    },
    bio: {
      type: String,
      required: function () {
        return !["admin"].includes(this.role);
      },
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "property_owner", "buyer", "tenant"],
      default: "user",
    },
  },
  { timestamps: true },
);

const userModel = mongoose.model("user", userSchema);
export default userModel;
