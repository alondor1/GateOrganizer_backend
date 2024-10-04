import mongoose from "mongoose";

const HistorySchema = new mongoose.Schema({
  name: String,
  phone: String,
  accesstype: String,
  arrivaldate: String,
  arrivaltime: String,
  approver: String,
});

const HistoryModel = mongoose.model("history", HistorySchema);

export default HistoryModel;
