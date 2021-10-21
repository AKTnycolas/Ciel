const { Client } = require("discord.js");
require("dotenv").config();

const pastas = ["Information", "Owners"];

async function start() {
  try {
    const client = new Client({ intents: 23323 });

    await require("./client/fileLoader").start(client, pastas);

    await client.login(process.env.tokenBot);
    console.log("(INDEX): index carregada com sucesso");
  } catch (err) {
    console.log(err);
  }
}

start();