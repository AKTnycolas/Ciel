const { Client } = require("discord.js");
const fetch = require("node-fetch");
require("dotenv").config();

const pastas = ["Information", "Owner", "Config", "Utils", "Fun", "Moderation"];

async function start() {
  try {
    const client = new Client({ intents: 70655 });
    global.fetch = fetch;

    await require("./database/index").start();
    await require("./client/fileLoader").start(client, pastas);

    await client.login(process.env.tokenBot);
    console.log("[INDEX] - index carregada com sucesso");
  } catch (err) {
    console.log(err);
  }
}

start();
