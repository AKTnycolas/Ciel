const { Collection } = require("discord.js");
const { readdirSync } = require("fs");

module.exports = {
  async load(client) {
    //------------------VARIÁVEIS BASES----------------------//
    client.commands = new Collection();
    client.aliases = new Collection();
    client.cooldowns = [];
    //-------------------------------------------------------//

    //----------------LOADING THE COMMANDS-------------------//
    const folders = await readdirSync("./src/commands/");

    for (const folder of folders) {
      const commands = readdirSync(`./src/commands/${folder}`);

      commands.forEach((file) => {
        const archive = require(`../commands/${folder}/${file}`);
        const cmdName = file.split(".")[0];
        const props = archive.help;

        client.commands.set(cmdName, archive);
        props.aliases.forEach((alias) => {
          client.aliases.set(alias, cmdName);
        });

        delete require.cache[require.resolve(`../commands/${folder}/${file}`)];
      });
    }

    console.log("[COMANDOS] - todos os comandos do bot foram carregados");
    //-------------------------------------------------------//

    //----------------------BOT EVENTS-----------------------//
    const events = await readdirSync("./src/client/events");

    events.forEach((event) => {
      const file = require(`./events/${event}`);
      const eventName = event.split(".")[0];

      if (eventName === "ready") {
        client.once("ready", file.bind(null, client));
      } else {
        client.on(eventName, file.bind(null, client));
      }

      delete require.cache[require.resolve(`./events/${event}`)];
    });

    console.log(`[EVENTOS] - foram carregados ${events.length} eventos do bot`);
    //-------------------------------------------------------//

    //--------------------SYSTEM EVENTS----------------------//
    const processs = readdirSync("./src/client/process");

    processs.forEach((event) => {
      const file = require(`./process/${event}`);
      const eventName = event.split(".")[0];

      process.on(eventName, file.bind(null, client));
      delete require.cache[require.resolve(`./process/${event}`)];
    });

    console.log(
      `[NODEJS] - foram carregandos ${events.length} eventos do node`
    );
    //-------------------------------------------------------//
  },
};
