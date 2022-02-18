// Importing Node packages required for schema
const mongoose = require("mongoose");
const bcrypt = require("bcrypt-nodejs");

const Schema = mongoose.Schema;

//= ===============================
// Organization Schema
//= ===============================
const OrgSchema = new Schema(
  {
    org_name: {
      type: String,
      unique: true,
      required: true,
    },
    org_type: { type: String },
    address: { type: String },
    country: { type: String },
    website: { type: String },
    logo: { type: String },
    agree_terms: { type: String },
    contact_name: { type: String },
    contact_email: { type: String },
    contact_phone: { type: String },
    city: { type: String },
    state: { type: String },
    tags: [{ type: Schema.Types.ObjectId, ref: "FieldData" }],
    attr: { type: Object },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Organization", OrgSchema);
