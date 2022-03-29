const { MessageEmbed, Collection } = require("discord.js");
const { getter } = require("../../utils/emojis");
const { readdirSync } = require("fs");

exports.run = async (client, message, args) => {
  //---------------------SOME CHECKS-----------------------------//
  if (!args[0]) return message.reply("Você não inseriu o nome do comando!");
  //-------------------------------------------------------------//
  const Emojis = new getter(client);

  const embed = new MessageEmbed()
    .setAuthor({ name: "Reload", iconURL: Emojis.get("refresh").url })
    .setColor(process.env.colorEmbed);

  const cmd =
    client.commands.get(args[0]) ||
    client.commands.get(client.aliases.get(args[0]));
  if (!cmd) {
    embed.setDescription(`O Comando **${args[0]}** não foi encontrado`);
    return message.reply({ embeds: [embed] });
  }

  const { category, name, isSub, ref } = cmd.help;
  path = `../../commands/${category}/${name}`;

  //-------------------------------------------------------------//
  try {
    delete require.cache[require.resolve(path)];
    client.commands.delete(name);

    const newCommand = require(path);
    newCommand.help.category = category;
    client.commands.set(name, newCommand);

    if (isSub) {
      const subNames = readdirSync(`./src/commands/${category}/${ref}/`);
      const subs = new Collection();

      subNames.forEach((sub) => {
        const subPath = `../${category}/${ref}/` + sub;

        delete require.cache[require.resolve(subPath)];
        const subCommand = require(subPath);
        const subName = sub.split(".")[0];

        subs.set(subName, subCommand);
        delete require.cache[require.resolve(subPath)];
      });

      client.subCommands.set(ref, subs);
    }

    embed.setDescription(`O comando ${name} foi recarregado com sucesso`);
    message.reply({ embeds: [embed] });
  } catch (err) {
    embed.setDescription(err.message);
    message.reply({ embeds: [embed] });
    console.log(err.stack);
  }
  //-------------------------------------------------------------//
};

exports.help = {
  name: "reload",
  description: "Recarrega um comando",
  aliases: ["refresh"],
  usage: "reload [comando]",
};
