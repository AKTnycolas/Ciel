const { MessageEmbed, MessageButton, MessageActionRow } = require("discord.js");
const { stripIndents } = require("common-tags");
const Emojis = require("../../utils/emojis");

exports.run = async (client, message, args) => {
  // a basic check.
  if (!args[0]) return message.reply("Você não disse a sua sugestão!");
  if (args.join(" ").length < 25)
    return message.reply("A sua sugestão deve ter pelo menos 25 caracteres");

  //--------------------------VARIABLES--------------------------//
  const iconURL = message.author.displayAvatarURL({ dynamic: true });
  const sug = client.emojis.cache.get(Emojis.yes).url;
  const suport = "https://discord.gg/V9NQbXWqUs";

  const channel = client.channels.cache.get(process.env.sugChannel);
  const suggestion = args.join(" ").slice(0, 200);
  //-------------------------------------------------------------//

  //---------------------------EMBED-----------------------------//
  const embed = new MessageEmbed()
    .setAuthor({ name: "Uma nova sugestão", iconURL: sug })
    .setThumbnail(iconURL)
    .addField("Autor: ", message.author.tag)
    .addField("Servidor: ", message.guild.name)
    .addField("Sugestão: ", `\`\`\`\n${suggestion}\`\`\``)
    .setColor(process.env.colorEmbed)
    .setTimestamp();

  const rowSupport = new MessageActionRow().addComponents([
    new MessageButton()
      .setURL(suport)
      .setLabel("Suporte")
      .setEmoji(Emojis.suport)
      .setStyle("LINK"),
  ]);

  await channel.send({
    embeds: [embed],
  });

  await message.reply({
    content: stripIndents`A sua sugestão foi enviado com sucesso. entre no meu servidor
    de suporte para saber das novidades e atualizações`,
    components: [rowSupport],
  });
  //-------------------------------------------------------------//
};

exports.help = {
  name: "suggestion",
  description: "Use esse comando para sugerir algo",
  aliases: ["sug", "sugestão"],
  usage: "suggestion [sugestão]",
  category: "Utils",
};
