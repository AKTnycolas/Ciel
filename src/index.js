const { Client } = require("discord.js");
const fetch = require("node-fetch");
require("dotenv").config();

const pastas = ["Information", "Owner", "Config", "Utils"];

async function start() {
  try {
    const client = new Client({ intents: 2047 });
    global.fetch = fetch;

    await require("./client/fileLoader").start(client, pastas);
    await require("./database/index").start();

    await client.login(process.env.tokenBot);
    console.log("[INDEX] - index carregada com sucesso");
  } catch (err) {
    console.log(err);
  }
}

start();
