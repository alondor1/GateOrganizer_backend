import mongoose from "mongoose";

const GuestSchema = new mongoose.Schema({
  id: { type: String },
  fullName: { type: String },
});

const EntrySchema = new mongoose.Schema({
  name: String,
  guests: [GuestSchema],
  phone: String,
  accesstype: String,
  arrivaldate: String,
  arrivaltime: String,
  status: String,
  approver: String,
});

const EntryModel = mongoose.model("entrys", EntrySchema);

export default EntryModel;
