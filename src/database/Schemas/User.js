const { Schema, model } = require("mongoose");

const schemaUser = new Schema({
  _id: { type: String, require: true }
});

const User = model("users", schemaUser);
module.exports = User;
