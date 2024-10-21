import EntryModel from "../models/EntryData.js";
import BlacklistModel from "../models/BlacklistModel.js";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

// Get all entries
export const getEntries = async (req, res) => {
  try {
    const entries = await EntryModel.find();
    res.json(entries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create a new entry
export const createEntry = async (req, res) => {
  const newEntry = new EntryModel(req.body);
  try {
    const savedEntry = await newEntry.save();

    res.status(201).json(savedEntry);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete an entry
export const deleteEntry = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedEntry = await EntryModel.findByIdAndDelete(id);
    if (!deletedEntry) {
      return res.status(404).json({ error: "Entry not found" });
    }
    res.status(204).send(); // No content
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update entry status
export const updateEntryStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const updatedEntry = await EntryModel.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );
    if (!updatedEntry) {
      return res.status(404).send("Entry not found");
    }
    res.send(updatedEntry);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

export const quickFormMethod = async (req, res) => {
  const { email, name, approver, status, accesstype } = req.body;

  try {
    // Create the token with expiration
    const SecureToken = jwt.sign(
      {
        approver,
        status,
        accesstype,
      },
      process.env.JWT_SECRET, // Make sure this is set securely
      { expiresIn: "1h" } // Token valid for 1 hour
    );

    // Construct the link with query parameters
    const ContructorsLink = `${process.env.FRONTEND_URL}/#/contructors-page/${SecureToken}`;

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
      subject: "Constructor Invitation for SES Emek Ha'ella",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2 style="color: #007bff;">Hi ${name}, You’re Invited by ${approver} as a Constructor!</h2>
          <p>Hello,</p>
          <p>You are invited to the SES Emek Ha'ella site as a constructor. Please click the button below to accept the invitation and access the platform:</p>
          <p>!!! BE CAREFUL BEFORE PRESS ACCEPT, THIS IS A 1-HOUR LIMITED SECURED FORM !!!</p>
          <a href="${ContructorsLink}" style="text-decoration: none;">
            <button style="
              background-color: #007bff; 
              color: white; 
              padding: 10px 20px; 
              border: none; 
              border-radius: 5px; 
              cursor: pointer; 
              font-size: 16px;
              transition: background-color 0.3s ease;
            ">
              Accept Invitation
            </button>
          </a>
          <p style="margin-top: 20px;">If you were not expecting this invitation, please ignore this email.</p>
          <p>Best regards,<br/>SES Emek Ha'ella Support Team</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    res.status(200).send("Invitation link has been sent to email.");
  } catch (error) {
    console.error("Error sending email:", error); // Log error on server-side
    res.status(500).send("An error occurred while sending the invitation.");
  }
};

export const createEntryWithTokenAndExpire = async (req, res) => {
  const { token } = req.params; // Retrieve the token from the URL parameters

  if (!token) {
    return res.status(401).json({ message: "Authorization token required" });
  }

  try {
    // Check if the token is blacklisted
    const isBlacklisted = await BlacklistModel.findOne({ token });
    if (isBlacklisted) {
      return res.status(403).json({ message: "Token has already been used." });
    }

    // Verify and decode the JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Extract relevant data from the decoded token
    const { approver, status, accesstype } = decoded;

    // Create a new entry using the values from the token and request body
    const newEntry = new EntryModel({
      approver, // From token
      status, // From token
      accesstype, // From token
      name: req.body.name, // From request body
      arrivaldate: req.body.arrivaldate, // From request body
      guests: req.body.guests || [], // Optional guests from request
      phone: req.body.phone, // New phone field from request body
      arrivaltime: req.body.arrivaltime, // New arrival time from request body
    });

    // Save the new entry to the database
    const savedEntry = await newEntry.save();

    // Blacklist the token to expire it after use
    const blacklistedToken = new BlacklistModel({ token });
    await blacklistedToken.save();

    res.status(201).json(savedEntry); // Respond with the saved entry
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token has expired" });
    }
    res.status(500).json({ error: err.message });
  }
};

export const CheckBlacklist = async (req, res) => {
  const { token } = req.params;

  try {
    const isBlacklisted = await BlacklistModel.findOne({ token });

    if (isBlacklisted) {
      return res.status(200).json({ blacklisted: true });
    }

    return res.status(200).json({ blacklisted: false });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
