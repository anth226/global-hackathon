// Importing Node packages required for schema
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

//= ===============================
// Sponsor Schema
//= ===============================
const SponsorSchema = new Schema(
  {
    location: {
      type: Schema.Types.ObjectId,
      ref: "Location",
      required: false,
    },

    name: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      required: true,
    },
    imageUrl: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Sponsor", SponsorSchema);
