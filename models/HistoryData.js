import mongoose from "mongoose";

const GuestSchema = new mongoose.Schema({
  id: { type: String },
  fullName: { type: String },
});

const HistorySchema = new mongoose.Schema({
  name: String,
  guests: [GuestSchema],
  phone: String,
  accesstype: String,
  arrivaldate: String,
  arrivaltime: String,
  approver: String,
});

const HistoryModel = mongoose.model("history", HistorySchema);

export default HistoryModel;
