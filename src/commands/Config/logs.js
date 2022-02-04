const { MessageEmbed } = require("discord.js");
const { getter } = require("../../utils/emojis");

exports.run = async (client, message, args, { server }) => {
  //-------------------BASE VARIABLES----------------------//
  const Emojis = new getter(client);
  const iconURL = message.guild.iconURL({ dynamic: true });
  const member = message.member;
  //-------------------------------------------------------//

  if (!member.permissions.has("MANAGE_GUILD")) {
    return message.reply("Você precisa da permissão de Gerenciar Guilda!");
  }

  //----------------------STATUS--------------------------//
  if (["status", "sts"].includes(args[0])) {
    const toggle = server.logs.toggle
      .toString()
      .replace("true", "desativado")
      .replace("false", "ativado");

    server.logs.toggle = !server.logs.toggle;
    await server.save();
    return message.reply(`O sistema de logs foi **${toggle}**!`);
  }
  //-------------------------------------------------------//

  //-----------------------CHANNEL-------------------------//
  if (["canal", "channel"].includes(args[0])) {
    const channel = message.mentions.channels.first();
    if (!channel) return message.reply("Você não mencionou o canal!");
    else if (channel.id === server.logs.channel)
      return message.reply("Esse canal já está setado!");

    server.logs.channel = channel.id;
    await server.save();
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

  const embed = new MessageEmbed()
    .setThumbnail(iconURL)
    .addField(`${Emojis.get("info_azul")} Status do Sistema: `, toggle)
    .addField(`${Emojis.get("channel")} Canal: `, channel)
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
  category: "Config",
};
