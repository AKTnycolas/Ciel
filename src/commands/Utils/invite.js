const { MessageEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");

exports.run = (client, message, args) => {
  
  //-------------------------------------------------------------//
  const icon = client.user.displayAvatarURL({ dynamic: true });
  const inviteMe = `https://discord.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=8`;
  const support = "https://discord.gg/V9NQbXWqUs";
  //-------------------------------------------------------------//
  
  
  //-------------------------------------------------------------//
  const embed = new MessageEmbed()
    .setThumbnail(icon)
    .setDescription(stripIndents`
    [Me convide para o seu server](${inviteMe}) ou
    [Entre no meu servidor de suporte](${support})
    `)
    .setColor(process.env.colorEmbed);

  message.reply({
    embeds: [embed]
  });
  //-------------------------------------------------------------//
};

exports.help = {
  name: "invite",
  description: "Use esse comando para ver os meus links de invite",
  aliases: ["invites", "convidar"],
  usage: "invite",
  category: "Utils"
};
