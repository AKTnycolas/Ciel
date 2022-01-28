const { MessageEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");
const figlet = require("figlet");

exports.run = async (client, message, args) => {
  const texts = args.join(" ");

  if (!texts) return message.reply("Você não disse a mensagem!");
  if (texts.length < 1 || texts.length > 15)
    return message.reply(
      "A mensagem precisa ter pelo menos 1 caracteres e no máximo 15!"
    );

  figlet.text(args.join(" "), (err, result) => {
    message.reply(`\`\`\`\n${result}\`\`\``);
  });
};

module.exports.help = {
  name: "ascii",
  description: "Escreva uma mensagem no estilo ascii",
  aliases: [],
  usage: "ascii [texto]",
  category: "Utils",
};
