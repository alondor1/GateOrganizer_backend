import HistoryModel from "../models/HistoryData.js";

// Get all history
export const getHistory = async (req, res) => {
  try {
    const history = await HistoryModel.find();
    res.json(history);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create new history
export const createHistory = async (req, res) => {
  const newHistory = new HistoryModel(req.body);
  try {
    const savedHistory = await newHistory.save();
    res.status(201).json(savedHistory);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
