import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    fullName: { type: String, default: "" },
    profilePic: { type: String, default: "" },
    country: { type: String, default: "" },
    phone: { type: String, default: "" },
    desc: { type: String, default: "" },
    isSeller: { type: Boolean, default: false },
    isAdmin: { type: Boolean, default: false },
    totalEarnings: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);
