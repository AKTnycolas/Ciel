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
    const toggle = server.count.toggle
      .toString()
      .replace("true", "desativado")
      .replace("false", "ativado");

    await Guild.findByIdAndUpdate(server._id, {
      "count.toggle": !server.count.toggle,
    });
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
    await Guild.findByIdAndUpdate(server._id, {
      "count.message": msg,
    });
    return message.reply("A sua mensagem foi setada com sucesso!");
  }

  //-----------------------CHANNEL-------------------------//
  if (["canal", "channel"].includes(args[0])) {
    const channel = message.mentions.channels.first();

    if (!channel) return message.reply("Você não mencionou o canal!");
    else if (channel.id === server.count.channel)
      return message.reply("Esse canal já está setado!");

    await Guild.findByIdAndUpdate(server._id, {
      "count.channel": channel.id,
    });
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
  
  const uses = stripIndents`
  > ${server.prefix}contador status
  > ${server.prefix}contador canal <#${message.channelId}>
  > ${server.prefix}contador mensagem **{contador} membros**
  `;

  const embed = new MessageEmbed()
    .setThumbnail(iconURL)
    .addField(`${Emojis.get("info_azul")} Status do Sistema: `, toggle)
    .addField(`${Emojis.get("channel")} Canal: `, channel)
    .addField(`${Emojis.get("description")} Mensagem: `, server.count.message)
    .addField(`${Emojis.get("DISCORD_PARTNER_ID")} Possíveis Usos`, uses)
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
  permissions: ["MANAGE_GUILD"],
};
