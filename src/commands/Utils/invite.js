const { MessageEmbed, Permissions } = require("discord.js");
const { stripIndents } = require("common-tags");

exports.run = async (client, message, args) => {
  //-------------------------------------------------------------//
  const guild = client.guilds.cache.get(process.env.supportGuild);
  const icon = client.user.displayAvatarURL({ dynamic: true });
  const inviteMe = client.generateInvite({
    scopes: ["bot"],
    permissions: [Permissions.FLAGS.ADMINISTRATOR],
  });

  let support = guild.invites.cache.find((i) => i.maxAge === 0);

  if (!support) {
    const randomChannel = guild.channels.cache.first();
    const link = await guild.invites.create(randomChannel.id, { maxAge: 0 });
    support = link;
  }
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
    embeds: [embed],
  });
  //-------------------------------------------------------------//
};

exports.help = {
  name: "invite",
  description: "Use esse comando para ver os meus links de invite",
  aliases: ["invites", "convidar"],
  usage: "invite",
  category: "Utils",
};
