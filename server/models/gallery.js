// Importing Node packages required for schema
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

//= ===============================
// Gallery Schema
//= ===============================
const GallerySchema = new Schema(
  {
    project: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    challenge: {
      type: Schema.Types.ObjectId,
      ref: "Challenge",
      required: true,
    },
    name: { type: String, required: true },
    ready: { type: Boolean, default: false },
    file: { type: String },
    video: { type: String },
    links: [
      {
        title: { type: String },
        link: { type: String },
        key: { type: Number },
      },
    ],
    logo: { type: String },
    description: { type: String },
    short_description: { type: String },
    tags: [{ type: Schema.Types.ObjectId, ref: "FieldData" }],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Gallery", GallerySchema);
