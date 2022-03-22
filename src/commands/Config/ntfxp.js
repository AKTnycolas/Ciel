const { MessageEmbed, Util } = require("discord.js");
const { getter } = require("../../utils/emojis");
const { stripIndents } = require("common-tags");

exports.run = async (client, message, args, { server }) => {
  //------------------BASE VARIABLES----------------------//
  const { Guild } = client.database;
  const Emojis = new getter(client);
  const iconURL = message.guild.iconURL({ dynamic: true });
  //-------------------------------------------------------//

  //-----------------------CHANNEL------------------------//
  if (["canal", "channel"].includes(args[0])) {
    const channel =
      message.mentions.channels.first() || client.channels.cache.get(args[1]);

    if (!channel) {
      return message.reply(
        "Você não mencionou/disse o id do canal a ser setado!"
      );
    } else if (channel.id === server.levelMessage.channel) {
      return message.reply("Esse canal já está setado atualmente!");
    }

    await Guild.findByIdAndUpdate(server._id, {
      "levelMessage.channel": channel.id,
    });

    return message.reply(`O canal <#${channel.id}> foi setado com sucesso!`);
  }
  //-------------------------------------------------------//

  //------------------------MESSAGE------------------------//
  if (["mensagem", "message"].includes(args[0])) {
    const msg = args.splice(1).join(" ");

    if (!msg) {
      return message.reply("Você não disse a mensagem!");
    } else if (msg.length < 10) {
      return message.reply("A mensagem tem que ter pelo menos 10 caracteres!");
    } else if (msg === server.levelMessage.message) {
      return message.reply("Essa mensagem já está setada atualmente!");
    }

    await Guild.findByIdAndUpdate(server._id, {
      "levelMessage.message": Util.cleanCodeBlockContent(msg.substring(0, 90)),
    });

    return message.reply("A mensagem foi setada com sucesso!");
  }
  //-------------------------------------------------------//

  //----------------------TOGGLE---------------------------//
  if (["status", "sts"].includes(args[0])) {
    const status = server.levelMessage.toggle
      .toString()
      .replace("true", "desativado")
      .replace("false", "ativado");

    await Guild.findByIdAndUpdate(server._id, {
      "levelMessage.toggle": !server.levelMessage.toggle,
    });

    return message.reply(
      `As mensagens de level up foi **${status}** com sucesso!`
    );
  }
  //-------------------------------------------------------//

  //------------------EMBED----------------------//
  const templates = stripIndents`
  > **{member}** - menciona o membro
  > **{level}** - nível atual do membro
  > **{nextLevel}** - quantidade para passar de nível
  `;

  const toggle = server.levelMessage.toggle
    .toString()
    .replace("true", "ativado")
    .replace("false", "desativado");

  const channel =
    server.levelMessage.channel === "nenhuma"
      ? server.levelMessage.channel
      : `<#${server.levelMessage.channel}>`;


  const embed = new MessageEmbed()
    .setThumbnail(iconURL)
    .addField(`${Emojis.get("info_azul")} Status do Sistema: `, toggle)
    .addField(`${Emojis.get("channel")} Canal:`, channel)
    .addField(
      `${Emojis.get("description")} Mensagem De Level Up: `,
      `\`\`\`\n${server.levelMessage.message}\`\`\``
    )
    .addField(`${Emojis.get("edited")} Template strings`, templates)
    .setColor(process.env.colorEmbed);

  message.reply({
    embeds: [embed],
  });
  //-------------------------------------------------------//
};

module.exports.help = {
  name: "ntfxp",
  description: "Configure a mensagen de level up",
  aliases: ["tlm"],
  usage: "ntfxp <status|canal>",
  permissions: ["MANAGE_GUILD"],
};
