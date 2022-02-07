const { Schema, model } = require("mongoose");

const schemaGuild = new Schema({
  _id: { type: String, require: true },
  prefix: { type: String, default: process.env.basePrefix },
  welcome: {
    toggle: { type: Boolean, default: false },
    message: { type: String, default: "nenhuma" },
    channel: { type: String, default: "nenhuma" },
  },
  byebye: {
    toggle: { type: Boolean, default: false },
    message: { type: String, default: "nenhuma" },
    channel: { type: String, default: "nenhuma" },
  },
  logs: {
    toggle: { type: Boolean, default: false },
    channel: { type: String, default: "nenhum" },
  },
  count: {
    toggle: { type: Boolean, default: false },
    message: { type: String, default: "{contador}" },
    channel: { type: String, default: "nenhum" }
  },
  antieveryone: { type: Boolean, default: false },
});

const Guild = model("guilds", schemaGuild);
module.exports = Guild;
