// Importing Node packages required for schema
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

//= ===============================
// Label Schema
//= ===============================
const LabelSchema = new Schema(
  {
    participant: {
      type: String,
      required: true,
    },
    organization: {
      type: String,
      required: true,
    },
    challenge: {
      type: String,
      required: true,
    },
    project: {
      type: String,
      required: true,
    },
    gallery: {
      type: String,
      required: true,
    },
    review: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Label", LabelSchema);
