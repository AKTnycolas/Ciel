const { MessageEmbed } = require("discord.js");

exports.run = async (client, message, args) => {
  const author =
    client.users.findByName(args[0]) ||
    client.users.cache.get(args[0]) ||
    message.mentions.users.first() ||
    message.author;

  const banner = await client.users.fetch(author.id, {
    cache: false,
    force: true,
  }).banner;

  if (!banner)
    if (author.id === message.author.id)
      return message.reply("você não possui um banner!");
    else return message.reply("Esse usuário não possui um banner!");

  const embed = new MessageEmbed()
    .setDescription(`Clique [aqui](${banner}) para baixar o banner`)
    .setImage(banner)
    .setTimestamp()
    .setFooter({ text: author.tag })
    .setColor(process.env.colorEmbed);

  await message.reply({ embeds: [embed] });
};

module.exports.help = {
  name: "banner",
  description: "Veja o banner de um usuário",
  aliases: ["getbanner"],
  usage: "banner <nome|id|user>",
  category: "Information",
};
