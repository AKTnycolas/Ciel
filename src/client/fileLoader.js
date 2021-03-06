const { Collection } = require("discord.js");
const { readdirSync } = require("fs");

module.exports = {
  async load(client) {
    //------------------VARIÁVEIS BASES----------------------//
    client.commands = new Collection();
    client.aliases = new Collection();
    client.subCommands = new Collection();
    client.cooldowns = [];
    //-------------------------------------------------------//

    //----------------LOADING THE COMMANDS-------------------//
    const folders = await readdirSync("./src/commands/");

    for (const folder of folders) {
      const commands = readdirSync(`./src/commands/${folder}`).filter((name) =>
        name.endsWith(".js")
      );

      commands.forEach((file) => {
        const archive = require(`../commands/${folder}/${file}`);
        const cmdName = file.split(".")[0];
        const props = archive.help;
        archive.help.category = folder;

        if (props.isSub) {
          const subNames = readdirSync(
            `./src/commands/${folder}/${props.ref}/`
          );
          const subs = new Collection();

          subNames.forEach((sub) => {
            const subCommand = require(`../commands/${folder}/${props.ref}/${sub}`);
            const subName = sub.split(".")[0];

            subs.set(subName, subCommand);
            delete require.cache[
              require.resolve(`../commands/${folder}/${props.ref}/${sub}`)
            ];
          });

          client.subCommands.set(props.ref, subs);
        }

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

    //--------------------VULKAVA EVENTS----------------------//
    const vulkavaEvents = readdirSync("./src/client/vulkava/events");

    vulkavaEvents.forEach((event) => {
      const file = require(`./vulkava/events/${event}`);
      const eventName = event.split(".")[0];

      client.vulkava.on(eventName, file.bind(null, client));
      delete require.cache[require.resolve(`./vulkava/events/${event}`)];
    });

    console.log(
      `[VULKAVA] - foram carregandos ${events.length} eventos do vulkava`
    );
    //-------------------------------------------------------//
  },
};
