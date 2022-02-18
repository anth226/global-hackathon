// Importing Node packages required for schema
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

//= ===============================
// Project Vote Schema
//= ===============================
const ProjectVoteSchema = new Schema(
  {
    participant: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    gallery: {
      type: Schema.Types.ObjectId,
      ref: "Gallery",
      required: true,
    },
    issue1: {
      type: Number,
    },
    issue2: {
      type: Number,
    },
    issue3: {
      type: Number,
    },
    solution1: {
      type: Number,
    },
    solution2: {
      type: Number,
    },
    solution3: {
      type: Number,
    },
    solution4: {
      type: Number,
    },
    adoption1: {
      type: Number,
    },
    adoption2: {
      type: Number,
    },
    adoption3: {
      type: Number,
    },
    adoption4: {
      type: Number,
    },
    comment: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("ProjectVote", ProjectVoteSchema);
