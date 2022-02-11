const { Schema, model } = require("mongoose");

const schemaUser = new Schema({
  _id: { type: String, require: true },
  balance: {
    coins: { type: Number, default: 0 },
    bank: { type: Number, default: 0 },
  },
  cooldowns: {
    daily: { type: Number, default: 0 },
    work: { type: Number, default: 0 },
    theft: { type: Number, default: 0 }
  },
});

const User = model("users", schemaUser);
module.exports = User;
