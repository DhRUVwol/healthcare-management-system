// import mongoose from "mongoose";

// const UserSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
//   role: { type: String, enum: ["patient", "doctor", "admin"], required: true },
//   approved: { type: Boolean, default: false }, // Only for doctors
// });

// const User = mongoose.models.User || mongoose.model("User", UserSchema);
// export default User;


import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["patient", "doctor", "admin"], default: "patient" },
  },
  { timestamps: true }
);

// Hash password before saving

UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
  });

  
const User = mongoose.models.User || mongoose.model("User", UserSchema);
export default User;