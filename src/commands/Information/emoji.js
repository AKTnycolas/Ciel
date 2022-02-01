const { MessageEmbed } = require("discord.js");

exports.run = async (client, message, args) => {
  if (!args[0]) return message.reply("Você mencionou o emoji!");

  let resolve = client.emojis.resolveIdentifier(args[0]);
  resolve = decodeURIComponent(resolve).split(":");
  const emoji = client.emojis.cache.get(resolve[1]);

  if (!emoji)
    return message.reply("Desculpa, mas não consegui encontrar esse emoji");

  const url = emoji.url;
  const author = await emoji.fetchAuthor();
  const animated = emoji.animated
    .toString()
    .replace("true", "Sim")
    .replace("false", "Não");

  const embed = new MessageEmbed()
    .setAuthor({ name: emoji.name, url, iconURL: url })
    .setThumbnail(url)
    .addField("Nome: ", emoji.name)
    .addField("Id: ", emoji.id)
    .addField("Autor: ", author.tag)
    .addField("Animado: ", animated)
    .setColor(process.env.colorEmbed);

  await message.reply({ embeds: [embed] });
};

module.exports.help = {
  name: "emoji",
  description: "Veja as informações de um emoji",
  aliases: ["emojiinfo", "infoemoji"],
  usage: "emoji [emoji]",
  category: "Information",
};
