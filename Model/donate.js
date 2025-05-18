import mongoose from "mongoose";

const donateSchema = new mongoose.Schema({
  name: {type: String, required: true},
  email: {type: String, required: false},
  message: {type: String, required: false},
  amount: {type: Number, required: true},
  date: {type: Date, default: Date.now},
  
});
const DonateModel = mongoose.model.Donate || mongoose.model("Donate", donateSchema);

export default DonateModel;