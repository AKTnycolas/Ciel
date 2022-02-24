const { MessageEmbed } = require("discord.js");

exports.run = async (client, message, args) => {
  if (!args[0]) {
    return message.reply("Você não disse qual é o nome/id do emoji!");
  }

  const emoji = client.emojis.cache.find(
    (x) => x.name === args[0] || x.id === args[0]
  );

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
  name: "emojithief",
  description: "Pesquise um emoji usando o nome ou id",
  aliases: ["roubaremoji", "emoji2"],
  usage: "emojithief [nome|id]",
};
