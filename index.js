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
app.use(cors());

connectDB(); // Connect to the database

// Set up routes
app.use("/users", userRoutes);
app.use("/entries", entryRoutes);
app.use("/history", historyRoutes);
app.use("/auth", authRoutes);

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
