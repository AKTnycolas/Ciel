const { MessageEmbed, Util } = require("discord.js");
const { getter } = require("../../utils/emojis");
const { stripIndents } = require("common-tags");

exports.run = async (client, message, args, { server }) => {
  //------------------BASE VARIABLES----------------------//
  const Emojis = new getter(client);
  const iconURL = message.guild.iconURL({ dynamic: true });
  const member = message.member;
  //-------------------------------------------------------//

  if (!member.permissions.has("MANAGE_GUILD")) {
    return message.reply("Você precisa da permissão de Gerenciar Guilda!");
  }

  //-----------------------CHANNEL------------------------//
  if (["canal", "channel"].includes(args[0])) {
    const channel =
      message.mentions.channels.first() || client.channels.cache.get(args[1]);

    if (!channel) {
      return message.reply(
        "Você não mencionou/disse o id do canal a ser setado!"
      );
    } else if (channel.id === server.byebye.channel) {
      return message.reply("Esse canal já está setado atualmente!");
    }

    server.byebye.channel = channel.id;
    await server.save();

    return message.reply(`O canal <#${channel.id}> foi setado com sucesso!`);
  }
  //-------------------------------------------------------//

  //------------------------MESSAGE------------------------//
  if (["mensagem", "message"].includes(args[0])) {
    const msg = args.splice(1).join(" ");

    if (!msg) {
      return message.reply("Você não disse a mensagem de bye bye!");
    } else if (msg === server.byebye.message) {
      return message.reply("Essa mensagem já está setada atualmente!");
    }

    server.byebye.message = Util.cleanCodeBlockContent(msg.substring(0, 220));
    await server.save();

    return message.reply("A mensagem foi setada com sucesso!");
  }
  //-------------------------------------------------------//

  //----------------------TOGGLE---------------------------//
  if (["status", "sts"].includes(args[0])) {
    const status = server.byebye.toggle
      .toString()
      .replace("true", "desativado")
      .replace("false", "ativado");

    server.byebye.toggle = !server.byebye.toggle;
    await server.save();

    return message.reply(`O sistema de bye bye foi **${status}** com sucesso!`);
  }
  //-------------------------------------------------------//

  //------------------EMBED----------------------//
  const templates = stripIndents`
  > **{member}** - menciona o membro
  > **{guild}** - o nome do servidor
  > **{membercount}** - quantidade de membros
  `;

  const toggle = server.byebye.toggle
    .toString()
    .replace("true", "ativado")
    .replace("false", "desativado");

  const channel =
    server.byebye.channel === "nenhuma"
      ? server.byebye.channel
      : `<#${server.byebye.channel}>`;

  const embed = new MessageEmbed()
    .setThumbnail(iconURL)
    .addField(`${Emojis.get("info_azul")} Status do Sistema: `, toggle)
    .addField(`${Emojis.get("channel")} Canal:`, channel)
    .addField(
      `${Emojis.get("description")} Mensagem De bye bye: `,
      `\`\`\`\n${server.byebye.message}\`\`\``
    )
    .addField(`${Emojis.get("edited")} Template strings`, templates)
    .setColor(process.env.colorEmbed);

  message.reply({
    embeds: [embed],
  });
  //-------------------------------------------------------//
};

module.exports.help = {
  name: "byebye",
  description: "Configure o sistema de bye bye",
  aliases: ["bye"],
  usage: "byebye <status|mensagem|canal>",
  category: "Config",
};
