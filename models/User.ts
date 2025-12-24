import { Schema, model, models } from "mongoose";

const UserSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    fullname: { type: String, default: null },
    role: { type: String, default: "user" },
    location: { type: String, default: null },
    occupation: { type: String, default: null },
    organization: { type: String, default: null },
    isActive: { type: Boolean, default: true },
    bio: { type: String, default: null },
    avatar: { type: String, default: null },
    coverImage: { type: String },
  },
  { timestamps: true }
);

const User = models.User || model("User", UserSchema);
export default User;
