import UserModel from "../models/UserData.js";
import crypto from "crypto";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";

// Function to handle forgot password
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(404).send("No user with that email address.");
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpires = Date.now() + 5 * 60 * 1000; // Token valid for 5 minutes

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetTokenExpires;
    await user.save();

    const resetLink = `${process.env.FRONTEND_URL}/#/password-reset/${resetToken}`;

    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: "support@yourdomain.com",
      to: email,
      subject: "Password Reset",
      html: `
    <p>You requested a password reset</p>
    <p>Click the following button to reset your password:</p>
    <a href="${resetLink}" style="text-decoration: none;">
      <button style="
        background-color: #007bff; 
        color: white; 
        padding: 10px 20px; 
        border: none; 
        border-radius: 5px; 
        cursor: pointer; 
        transition: background-color 0.3s ease;
      ">
        Reset Password
      </button>
    </a>
    <p>If you didn't request this, please ignore this email.</p>
    `,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).send("Password reset link has been sent to your email.");
  } catch (error) {
    console.error("Error in forgot password:", error);
    res.status(500).send("Error in forgot password.");
  }
};

// Function to handle password reset
export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { newPassword } = req.body;

  try {
    const user = await UserModel.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).send("Invalid or expired password reset token.");
    }

    user.password = newPassword; // Password is already hashed in UserModel
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).send("Password has been reset successfully.");
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).send("Error resetting password.");
  }
};

// Function to handle login
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await UserModel.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).send("Invalid email or password");
    }

    res.status(200).json({
      firstname: user.firstname,
      lastname: user.lastname,
      accesskey: user.accesskey,
    });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).send("Error logging in user");
  }
};

// Validate token function
export const validateToken = async (req, res) => {
  const { token } = req.params;

  const user = await UserModel.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).send("Invalid or expired password reset token.");
  }

  res.status(200).send("Token is valid.");
};
