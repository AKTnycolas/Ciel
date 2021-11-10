const { MessageEmbed } = require("discord.js");
// I'm thinking about putting an embed

exports.run = (client, message, args) => {
  if (message.author.id !== "822819247146663936") return;
  if (!args[0]) return;

  try {
    const cmd =
      client.commands.get(args[0]) ||
      client.commands.get(client.aliases.get(args[0]));

    const path = `../../commands/${cmd.help.category}/${cmd.help.name}`;

    delete require.cache[require.resolve(path)];
    client.commands.delete(cmd.help.name);

    const newCommand = require(path);
    client.commands.set(cmd.help.name, newCommand);

    message.reply(`O comando ${cmd.help.name} foi recarregado com sucesso`);
  } catch (err) {
    message.reply(err.message);
  }
};

module.exports.help = {
  name: "reload",
  description: "Recarrega um comando",
  aliases: [],
  usage: "<prefixo>reload [cmdName]",
  category: "Owner"
};
