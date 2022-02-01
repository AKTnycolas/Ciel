const { MessageEmbed, MessageButton, MessageActionRow } = require("discord.js");
const { stripIndents } = require("common-tags");
const { getter } = require("../../utils/emojis");

exports.run = async (client, message, args) => {
  // a basic check.
  if (!args[0]) return message.reply("Você não colocou o motivo!");
  if (args.join(" ").length < 25)
    return message.reply("O seu report deve ter pelo menos 25 caracteres");

  //--------------------------VARIABLES--------------------------//
  const iconURL = message.author.displayAvatarURL({ dynamic: true });
  const suport = "https://discord.gg/V9NQbXWqUs";
  const Emojis = new getter(client);

  const channel = client.channels.cache.get(process.env.bugChannel);
  const reason = args.join(" ").slice(0, 200);
  //-------------------------------------------------------------//

  //---------------------------EMBED-----------------------------//
  const embed = new MessageEmbed()
    .setAuthor({
      name: "Mais um bug encontrado",
      iconURL: Emojis.get("bug").url,
    })
    .setThumbnail(iconURL)
    .addField("Autor: ", message.author.tag)
    .addField("Servidor: ", message.guild.name)
    .addField("Motivo: ", `\`\`\`\n${reason}\`\`\``)
    .setColor(process.env.colorEmbed)
    .setTimestamp();

  const rowSupport = new MessageActionRow().addComponents([
    new MessageButton()
      .setURL(suport)
      .setLabel("Suporte")
      .setEmoji(Emojis.get("suport"))
      .setStyle("LINK"),
  ]);

  await channel.send({
    embeds: [embed],
  });

  await message.reply({
    content: stripIndents`O seu report foi enviado com sucesso.
    entre no meu servidor de suporte para saber das novidades e atualizações`,
    components: [rowSupport],
  });
  //-------------------------------------------------------------//
};

exports.help = {
  name: "bugreport",
  description: "Use esse comando para reportar bugs do bot",
  aliases: ["bug", "report"],
  usage: "bugreport [motivo]",
  category: "Utils",
};
