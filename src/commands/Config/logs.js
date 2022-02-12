const { MessageEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");
const { getter } = require("../../utils/emojis");

exports.run = async (client, message, args, { server }) => {
  //-------------------BASE VARIABLES----------------------//
  const { Guild } = client.database;
  const Emojis = new getter(client);
  const iconURL = message.guild.iconURL({ dynamic: true });
  //-------------------------------------------------------//

  //----------------------STATUS--------------------------//
  if (["status", "sts"].includes(args[0])) {
    const toggle = server.logs.toggle
      .toString()
      .replace("true", "desativado")
      .replace("false", "ativado");

    await Guild.findByIdAndUpdate(server._id, {
      "logs.toggle": !server.logs.toggle,
    });
    return message.reply(`O sistema de logs foi **${toggle}**!`);
  }
  //-------------------------------------------------------//

  //-----------------------CHANNEL-------------------------//
  if (["canal", "channel"].includes(args[0])) {
    const channel = message.mentions.channels.first();
    if (!channel) return message.reply("Você não mencionou o canal!");
    else if (channel.id === server.logs.channel)
      return message.reply("Esse canal já está setado!");

    await Guild.findByIdAndUpdate(server._id, {
      "logs.channel": channe.id,
    });
    return message.reply(`O canal <#${channel.id}> foi setado com sucesso!`);
  }
  //-------------------------------------------------------//

  //-----------------------EMBED---------------------------//
  const toggle = server.logs.toggle
    .toString()
    .replace("true", "ativado")
    .replace("false", "desativado");

  const channel =
    server.logs.channel === "nenhum"
      ? server.logs.channel
      : `<#${server.logs.channel}>`;
  
  const uses = stripIndents`
  > ${server.prefix}logs status
  > ${server.prefix}logs canal <#${message.channelId}>
  `;

  const embed = new MessageEmbed()
    .setThumbnail(iconURL)
    .addField(`${Emojis.get("info_azul")} Status do Sistema: `, toggle)
    .addField(`${Emojis.get("channel")} Canal: `, channel)
    .addField(`${Emojis.get("DISCORD_PARTNER_ID")} Possíveis Usos: `, uses)
    .setColor(process.env.colorEmbed);

  message.reply({
    embeds: [embed],
  });
  //-------------------------------------------------------//
};

module.exports.help = {
  name: "logs",
  description: "Configure o sistema de logs",
  aliases: ["log", "setlogs"],
  usage: "logs <status|canal>",
  permissions: ["MANAGE_GUILD"],
  category: "Config",
};
