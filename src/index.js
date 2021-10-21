const { Client } = require("discord.js");
require("dotenv").config();

const pastas = ["Information", "Owners", "Config"];

async function start() {
  try {
    const client = new Client({ intents: 23323 });

    await require("./client/fileLoader").start(client, pastas);
    await require("./database/index").start();

    await client.login(process.env.tokenBot);
    console.log("[INDEX] - index carregada com sucesso");
  } catch (err) {
    console.log(err);
  }
}

start();