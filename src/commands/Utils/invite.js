const { MessageEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");

exports.run = async (client, message) => {
  const icon = client.user.displayAvatarURL({ dynamic: true });
  
  //-------------------------------------------------------------//
  const embed = new MessageEmbed()
    .setThumbnail(icon)
    .setDescription(stripIndents`
    [Me convide para o seu server](${client.invites.me}) ou
    [Entre no meu servidor de suporte](${client.invites.suport})
    `)
    .setColor(process.env.colorEmbed);

  message.reply({
    embeds: [embed],
  });
  //-------------------------------------------------------------//
};

exports.help = {
  name: "invite",
  description: "Use esse comando para ver os meus links de invite",
  aliases: ["invites", "convidar"],
  usage: "invite",
};
