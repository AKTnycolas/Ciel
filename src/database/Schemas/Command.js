const { Schema, model } = require("mongoose");

const schemaCmd = new Schema({
  _id: { type: String, require: true },
  manu: { type: Boolean, default: false },
  date: { type: Date, default: Date.now },
  reason: { type: String, require: false }
});

const Command = model("commands", schemaCmd);
module.exports = Command;
