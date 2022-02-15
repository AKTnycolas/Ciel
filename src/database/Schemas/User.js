const { Schema, model } = require("mongoose");

const schemaUser = new Schema({
  _id: { type: String, require: true },
  reps: { type: Number, default: 0 },
  balance: {
    coins: { type: Number, default: 0 },
    bank: { type: Number, default: 0 },
  },
  exp: {
    xp: { type: Number, default: 1 },
    level: { type: Number, default: 1 },
    nextLevel: { type: Number, default: 100 },
  },
  cooldowns: {
    daily: { type: Number, default: 0 },
    work: { type: Number, default: 0 },
    theft: { type: Number, default: 0 },
    rep: { type: Number, default: 0 },
  },
});

const User = model("users", schemaUser);
module.exports = User;
