// Importing Node packages required for schema
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

//= ===============================
// Meeting Schema
//= ===============================
const MeetingSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Meeting", MeetingSchema);
