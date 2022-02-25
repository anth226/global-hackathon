// Importing Node packages required for schema
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

//= ===============================
// Room Schema
//= ===============================
const RoomSchema = new Schema(
  {
    project: {
      type: Schema.Types.ObjectId,
      ref: "Project",
    },
    sid: {
      type: String,
      required: true,
    },
    breakouts: [
      {
        type: String,
      },
    ],
    // parentSid: {
    //   type: Schema.Types.ObjectId,
    //   ref: "Room",
    // },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Room", RoomSchema);
