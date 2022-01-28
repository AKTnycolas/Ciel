const { Collection } = require("discord.js");
const { readdir } = require("fs");
const { notifier } = require("../utils/plugins/notifier");

module.exports = {
  async start(client, pastas) {
    client.commands = new Collection();
    client.aliases = new Collection();

    //--------------------COMANDOS--------------------//

    await pastas.forEach(p => {
      readdir(`./src/commands/${p}`, (err, commands) => {
        if (err) throw "[LOADFILES] - " + err;

        commands.forEach(file => {
          const archive = require(`../commands/${p}/${file}`);
          const cmdName = file.split(".")[0];
          const props = archive.help;

          client.commands.set(cmdName, archive);

          props.aliases.forEach(alias => {
            client.aliases.set(alias, cmdName);
          });
          delete require.cache[require.resolve(`../commands/${p}/${file}`)];
        });
      });
    });
    console.log(
      `[COMANDOS] - todos os comandos do bot foram carregados`
    );

    //--------------------EVENTOS--------------------//

    await readdir("./src/client/events", (err, events) => {
      if (err) throw "[LOADFILES] - " + err;

      events.forEach(event => {
        const file = require(`./events/${event}`);
        const eventName = event.split(".")[0];

        if (eventName === "ready") {
          client.once("ready", file.bind(null, client));
        } else {
          client.on(eventName, file.bind(null, client));
        }

        delete require.cache[require.resolve(`./events/${event}`)];
      });
      console.log(
        `[EVENTOS] - foram carregados ${events.length} eventos do bot`
      );
    });

    //-------------------------------------------------------------//
    await readdir("./src/client/process", (err, events) => {
      if (err) throw "[LOADFILES] - " + err;

      events.forEach(event => {
        const file = require(`./process/${event}`);
        const eventName = event.split(".")[0];

        process.on(eventName, file.bind(null, client));
        delete require.cache[require.resolve(`./process/${event}`)];
      });

      console.log(
        `[NODEJS] - foram carregandos ${events.length} eventos do node`
      );
    });
  }
};
