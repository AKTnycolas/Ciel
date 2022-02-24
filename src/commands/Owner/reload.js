const { MessageEmbed } = require("discord.js");
const { getter } = require("../../utils/emojis");

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
  const path = `../../commands/${cmd.help.category}/${cmd.help.name}`;

  //-------------------------------------------------------------//
  try {
    delete require.cache[require.resolve(path)];
    client.commands.delete(cmd.help.name);

    const newCommand = require(path);
    client.commands.set(cmd.help.name, newCommand);

    embed.setDescription(
      `O comando ${cmd.help.name} foi recarregado com sucesso`
    );
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
