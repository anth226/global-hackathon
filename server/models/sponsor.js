// Importing Node packages required for schema

const mongoose = require("mongoose");

const Schema = mongoose.Schema;

//= ===============================
// Sponsor Schema
//= ===============================

const SponsorSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  origin: {
    type: String,
    required: false,
  },
});

module.exports = mongoose.model("Sponsor", SponsorSchema);
