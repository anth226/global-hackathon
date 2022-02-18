// Importing Node packages required for schema
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

//= ===============================
// Project Schema
//= ===============================
const ProjectSchema = new Schema(
  {
    participant: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    challenge: {
      type: Schema.Types.ObjectId,
      ref: "Challenge",
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    logo: {
      type: String,
    },
    short_description: {
      type: String,
      required: true,
    },
    collaborators: {
      type: String,
    },
    country: {
      type: String,
    },
    tags: [{ type: Schema.Types.ObjectId, ref: "FieldData" }],
    sharers: { type: [String] },
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    public: { type: Boolean, default: true },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Project", ProjectSchema);
