const { connect } = require("mongoose");
const { readdirSync } = require("fs");

module.exports = {
  async start(client) {
    try {
      await connect(process.env.tokenData);
      const models = readdirSync("./src/database/Schemas/");
      client.database = {};
      
      for (const model of models) {
        const name = model.split(".")[0];
        client.database[name] = require(`./Schemas/${model}`);
      }

      console.log("[DATABASE] - conectado ao banco de dados");
    } catch (err) {
      throw new Error("[DATABASE] - " + err);
    }
  },
};
