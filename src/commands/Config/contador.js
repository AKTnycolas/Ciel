const { MessageEmbed } = require("discord.js");
const { getter } = require("../../utils/emojis");

exports.run = async (client, message, args, { server }) => {
  //-------------------BASE VARIABLES----------------------//
  const Emojis = new getter(client);
  const iconURL = message.guild.iconURL({ dynamic: true });
  const member = message.member;
  //-------------------------------------------------------//

  if (!member.permissions.has("MANAGE_GUILD")) {
    return message.reply("Você precisa da permissão Gerenciar Guilda!");
  }

  //----------------------STATUS--------------------------//
  if (["status", "sts"].includes(args[0])) {
    const toggle = server.count.toggle
      .toString()
      .replace("true", "desativado")
      .replace("false", "ativado");

    server.count.toggle = !server.count.toggle;
    await server.save();
    return message.reply(`O sistema foi **${toggle}**!`);
  }
  //-------------------------------------------------------//

  if (["mensagem", "message"].includes(args[0])) {
    if (!args) return message.reply("Você não disse a mensagem!");
    const msg = args.slice(1).join(" ");

    if (msg.length > 55 || msg.length < 10)
      return message.reply(
        "O máximo de caracteres é de **55**, eo mínimo é **10**"
      );
    server.count.message = msg;
    await server.save();
    return message.reply("A sua mensagem foi setada com sucesso!");
  }

  //-----------------------CHANNEL-------------------------//
  if (["canal", "channel"].includes(args[0])) {
    const channel = message.mentions.channels.first();

    if (!channel) return message.reply("Você não mencionou o canal!");
    else if (channel.id === server.count.channel)
      return message.reply("Esse canal já está setado!");

    server.count.channel = channel.id;
    await server.save();
    return message.reply(`O canal <#${channel.id}> foi setado com sucesso!`);
  }
  //-------------------------------------------------------//

  //-----------------------EMBED---------------------------//
  const toggle = server.count.toggle
    .toString()
    .replace("true", "ativado")
    .replace("false", "desativado");

  const channel =
    server.count.channel === "nenhum"
      ? server.count.channel
      : `<#${server.count.channel}>`;

  const embed = new MessageEmbed()
    .setThumbnail(iconURL)
    .addField(`${Emojis.get("info_azul")} Status do Sistema: `, toggle)
    .addField(`${Emojis.get("channel")} Canal: `, channel)
    .addField(`${Emojis.get("description")} Mensagem: `, server.count.message)
    .setColor(process.env.colorEmbed);

  message.reply({
    embeds: [embed],
  });
  //-------------------------------------------------------//
};

module.exports.help = {
  name: "contador",
  description: "Configure o contador de membros",
  aliases: ["cont", "counter"],
  usage: "contador <status|mensagem>",
  category: "Config",
};