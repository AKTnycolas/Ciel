const { Schema, model } = require("mongoose");

const schemaImg = new Schema({
  _id: { type: String, require: true },
  images: { type: Array, default: [] },
});

const Images = model("images", schemaImg);
module.exports = Images;
