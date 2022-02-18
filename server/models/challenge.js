// Importing Node packages required for schema
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

//= ===============================
// Challenge Schema
//= ===============================
const ChallengeSchema = new Schema(
  {
    challenge_name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    geography: {
      type: String,
      required: true,
    },
    short_description: {
      type: String,
      required: true,
    },
    organization: {
      type: Schema.Types.ObjectId,
      ref: "Organization",
    },
    participant: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    logo: {
      type: String,
    },
    benefit: {
      type: String,
    },    
    stackholders: {
      type: String,
    },
    keywords: {
      type: String,
    },
    tags: [{ type: Schema.Types.ObjectId, ref: "FieldData" }],
    public: { type: Boolean, default: false },
    supports: [{ type: Schema.Types.ObjectId, ref: "Organization" }],
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Challenge", ChallengeSchema);
