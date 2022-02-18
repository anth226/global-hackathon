// Importing Node packages required for schema
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

//= ===============================
// Challenge Schema
//= ===============================
const GuidSchema = new Schema(
  {
    guid: {
      type: String,
      required: true,
    },
    sid: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Guid", GuidSchema);
