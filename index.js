import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import entryRoutes from "./routes/entryRoutes.js";
import historyRoutes from "./routes/historyRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import { errorHandler } from "./middlewares/errorMiddleware.js";

dotenv.config();
const app = express();
app.use(express.json());

// CORS configuration
const allowedOrigins = [
  "http://localhost:3000",
  "https://gateorganizer-frontend.onrender.com",
]; // Add your production URL here
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const message =
          "The CORS policy for this site does not allow access from the specified Origin.";
        return callback(new Error(message), false);
      }
      return callback(null, true);
    },
  })
);

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

// Error handling middleware
app.use(errorHandler);

app.get("/", (req, res) => {
  res.send("Server is running!");
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
