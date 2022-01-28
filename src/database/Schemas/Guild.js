const { Schema, model } = require("mongoose");

const schemaGuild = new Schema({
  _id: { type: String, require: true },
  prefix: { type: String, default: process.env.basePrefix },
  antieveryone: { type: Boolean, default: false }
});

const Guild = model("guilds", schemaGuild);
module.exports = Guild;