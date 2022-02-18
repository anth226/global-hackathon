// Importing Node packages required for schema
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

//= ===============================
// Resource Schema
//= ===============================
const ResourceSchema = new Schema(
  {
    title: { type: String, required: true },
    short_description: { type: String },
    link: { type: String },
    type: { type: String, default: "link" },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Resource", ResourceSchema);
