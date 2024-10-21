import mongoose from "mongoose";
import bcrypt from "bcrypt";

// User Schema
const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (v) {
        // Basic email format validation
        return /\S+@\S+\.\S+/.test(v);
      },
      message: (props) => `${props.value} is not a valid email!`,
    },
  },
  password: { type: String, required: true },
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  accesskey: { type: String, required: true },
  role: { type: String, required: true },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
}); // Adds createdAt and updatedAt fields

// Pre-save middleware to hash password
UserSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Model
const UserModel = mongoose.model("users", UserSchema);

export default UserModel;
