import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bcrypt from "bcrypt";
import UserModel from "./models/UserData.js";
import EntryModel from "./models/EntryData.js";
import HistoryModel from "./models/HistoryData.js";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

const app = express();
app.use(express.json());

// CORS configuration
const allowedOrigins = ['http://localhost:3000', 'https://gateorganizer-frontend.onrender.com']; // Add your production URL here
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const message = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(message), false);
    }
    return callback(null, true);
  }
}));

// Connect to MongoDB using the environment variable
mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 20000,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// User routes
app
  .route("/getUsers")
  .get((req, res) => {
    UserModel.find()
      .then((users) => res.json(users))
      .catch((err) => res.status(500).json({ error: err.message }));
  })
  .post(async (req, res) => {
    const newUser = new UserModel(req.body);
    console.log("Creating new user:", newUser);
    try {
      const savedUser = await newUser.save();
      res.status(201).json(savedUser);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

app.delete("/getUsers/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const deletedUser = await UserModel.findByIdAndDelete(id);
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json({ message: "User deleted successfully", deletedUser });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Entry routes
app
  .route("/getEntrys")
  .get((req, res) => {
    EntryModel.find()
      .then((entrys) => res.json(entrys))
      .catch((err) => res.status(500).json({ error: err.message }));
  })
  .post(async (req, res) => {
    const newEntry = new EntryModel(req.body);
    console.log("Creating new entry:", newEntry);
    try {
      const savedEntry = await newEntry.save();
      res.status(201).json(savedEntry);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

app.delete("/getEntrys/:_id", async (req, res) => {
  console.log("Deleting entry with ID:", req.params._id);
  try {
    const deletedEntry = await EntryModel.findByIdAndDelete(req.params._id);
    if (!deletedEntry) {
      return res.status(404).json({ error: "Entry not found" });
    }
    res.status(204).send(); // No content
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// History routes
app
  .route("/getHistory")
  .get((req, res) => {
    HistoryModel.find()
      .then((history) => res.json(history))
      .catch((err) => res.status(500).json({ error: err.message }));
  })
  .post(async (req, res) => {
    const newHistory = new HistoryModel(req.body);
    console.log("Creating new history:", newHistory);
    try {
      const savedHistory = await newHistory.save();
      res.status(201).json(savedHistory);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });

// Update entry status
app.put("/getEntrys/:id", async (req, res) => {
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
});

// Login route
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  console.log("new login: " + req.body.email);
  try {
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(401).send("Invalid email or password");
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
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
});

// Start the server using the PORT variable
app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});

