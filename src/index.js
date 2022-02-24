const { Client } = require("discord.js");
require("dotenv").config();

async function start() {
  try {
    const client = new Client({ intents: 70655 });
    global.fetch = require("node-fetch");

    await require("./database/index").start(client);
    await require("./client/vulkava/index").start(client);
    await require("./client/fileLoader").load(client);

    await client.login(process.env.tokenBot);
    console.log("[INDEX] - index carregada com sucesso");
  } catch (err) {
    console.log(err);
  }
}

start();
