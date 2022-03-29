const { Schema, model } = require("mongoose");

const schemaCompany = new Schema({
  name: { type: String, default: "null" },
  description: { type: String, default: "null" },
  owner: { type: String, require: true },
  wage: { type: Number, default: 500 },
  xp: { type: Number, default: 0 },
  level: { type: Number, default: 1 },
  nextLevel: { type: Number, default: 650 },
  employees: { type: Array, default: [] },
});

const Company = model("company", schemaCompany);
module.exports = Company;
