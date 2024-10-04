import mongoose from "mongoose";

const EntrySchema = new mongoose.Schema({
  name: String,
  phone: String,
  accesstype: String,
  arrivaldate: String,
  arrivaltime: String,
  status: String,
  approver: String,
});

const EntryModel = mongoose.model("entrys", EntrySchema);

export default EntryModel;
