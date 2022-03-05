// Importing Node packages required for schema
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

//= ===============================
// Location Schema
//= ===============================
const LocationSchema = new Schema(
  {
    venue: {
      type: String,
      required: true,
    },
    venue_city: {
      type: String,
    },
    venue_country: {
      type: String,
    },
    venue_street: {
      type: String,
    },
    venue_zip: {
      type: String,
    },
    organization: {
      type: String,
      required: true,
    },
    job_title: {
      type: String,
      required: true,
    },
    before_helped: {
      type: String,
      required: true,
    },
    have_condition: {
      type: String,
      required: true,
    },
    have_help: {
      type: String,
      required: true,
    },
    hosted_2019: {
      type: String,
      required: true,
    },
    multi_city: {
      type: String,
      required: true,
    },
    support_food: {
      type: String,
      required: true,
    },
    participants_number: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      default: "pending",
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    content: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Location", LocationSchema);
