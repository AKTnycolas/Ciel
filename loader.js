/* eslint-disable no-unused-vars */
const { Collection } = require("discord.js");
const { readdirSync } = require("fs");

module.exports = {
  async start(args) {
    const subsNames = await readdirSync("./src/commands/Economy/Company/")
      .map(subName => subName.split(".")[0]);
    
  },
};
