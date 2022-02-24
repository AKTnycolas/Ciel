const { MessageEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");
const { cooldown } = require("../../utils/plugins/dates");

exports.run = async (client, message) => {
  if (!message.member.voice.channelId)
    return message.reply("Primeiro você precisa entrar em um canal de voz!");

  const player = client.vulkava.players.get(message.guild.id);

  if (!player || message.member.voice.channelId !== player.voiceChannelId)
    return message.reply(
      "Eu não estou tocando nenhuma música nesse canal de voz!"
    );

  const channel = client.channels.cache.get(player.textChannelId);
  const cut = (title) => {
    title = title.length > 46 ? title.substring(0, 46) : title;
    return title.toLowerCase();
  };
  const track = player.current;

  const playing = stripIndents`
  Tocando Agora:
  > Título: [${cut(track.title)}](${track.uri})
  > Author: **${track.author}**
  > Requisitado Por: ${track.requester}
  > Duração: **${cooldown(new Date(track.duration))}**
  `;

  const embed = new MessageEmbed()
    .setDescription(playing)
    .setColor(process.env.colorEmbed);

  await channel.send({ embeds: [embed] });
};

exports.help = {
  name: "now",
  description: "Veja informações da música que tá tocando",
  aliases: ["np", "nowplaying"],
  usage: "now",
  category: "Music",
};
