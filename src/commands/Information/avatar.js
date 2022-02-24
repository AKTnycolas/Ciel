const { MessageEmbed } = require("discord.js");

exports.run = async (client, message, args) => {
  const author =
    client.users.findByName(args[0]) ||
    client.users.cache.get(args[0]) ||
    message.mentions.users.first() ||
    message.author;
  const avatar = author.displayAvatarURL({ dynamic: true, size: 2048 });

  const embed = new MessageEmbed()
    .setDescription(`Clique [aqui](${avatar}) para baixar o avatar`)
    .setImage(avatar)
    .setTimestamp()
    .setFooter({ text: author.tag })
    .setColor(process.env.colorEmbed);

  await message.reply({ embeds: [embed] });
};

module.exports.help = {
  name: "avatar",
  description: "Veja o avatar de um usuário",
  aliases: ["getavatar"],
  usage: "avatar <nome|id|user>",
};
