const { MessageEmbed, Util } = require("discord.js");
const { getter } = require("../../utils/emojis");
const { stripIndents } = require("common-tags");

exports.run = async (client, message, args, { server }) => {
  //------------------BASE VARIABLES----------------------//
  const { Guild } = client.database;
  const Emojis = new getter(client);
  const iconURL = message.guild.iconURL({ dynamic: true });
  //-------------------------------------------------------/

  //-----------------------CHANNEL------------------------//
  if (["canal", "channel"].includes(args[0])) {
    const channel =
      message.mentions.channels.first() || client.channels.cache.get(args[1]);

    if (!channel) {
      return message.reply(
        "Você não mencionou/disse o id do canal a ser setado!"
      );
    } else if (channel.id === server.welcome.channel) {
      return message.reply("Esse canal já está setado atualmente!");
    }

    await Guild.findByIdAndUpdate(server._id, {
      "welcome.channel": channel.id,
    });

    return message.reply(`O canal <#${channel.id}> foi setado com sucesso!`);
  }
  //-------------------------------------------------------//

  //------------------------MESSAGE------------------------//
  if (["mensagem", "message"].includes(args[0])) {
    const msg = args.splice(1).join(" ");

    if (!msg) {
      return message.reply("Você não disse a mensagem de boas vindas!");
    } else if (msg === server.welcome.message) {
      return message.reply("Essa mensagem já está setada atualmente!");
    }

    await Guild.findByIdAndUpdate(server._id, {
      "welcome.message": Util.cleanCodeBlockContent(msg.substring(0, 220)),
    });

    return message.reply("A mensagem foi setada com sucesso!");
  }
  //-------------------------------------------------------//

  //----------------------TOGGLE---------------------------//
  if (["status", "sts"].includes(args[0])) {
    const status = server.welcome.toggle
      .toString()
      .replace("true", "desativado")
      .replace("false", "ativado");

    await Guild.findByIdAndUpdate(server._id, {
      "welcome.toggle": !server.welcome.toggle,
    });

    return message.reply(`O sistema de welcome foi **${status}** com sucesso!`);
  }
  //-------------------------------------------------------//

  //------------------EMBED----------------------//
  const templates = stripIndents`
  > **{member}** - menciona o membro
  > **{guild}** - o nome do servidor
  > **{membercount}** - quantidade de membros
  `;

  const toggle = server.welcome.toggle
    .toString()
    .replace("true", "ativado")
    .replace("false", "desativado");

  const channel =
    server.welcome.channel === "nenhuma"
      ? server.welcome.channel
      : `<#${server.welcome.channel}>`;

  const embed = new MessageEmbed()
    .setThumbnail(iconURL)
    .addField(`${Emojis.get("info_azul")} Status do Sistema: `, toggle)
    .addField(`${Emojis.get("channel")} Canal:`, channel)
    .addField(
      `${Emojis.get("description")} Mensagem De Boas Vindas: `,
      `\`\`\`\n${server.welcome.message}\`\`\``
    )
    .addField(`${Emojis.get("edited")} Template strings`, templates)
    .setColor(process.env.colorEmbed);

  message.reply({
    embeds: [embed],
  });
  //-------------------------------------------------------//
};

module.exports.help = {
  name: "welcome",
  description: "Configure o sistema de welcome",
  aliases: ["wel"],
  usage: "welcome <status|message|canal>",
  permissions: ["MANAGE_GUILD"],
};
