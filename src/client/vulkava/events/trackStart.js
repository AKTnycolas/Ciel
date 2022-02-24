const { MessageEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");
const { cooldown } = require("../../../utils/plugins/dates");

module.exports = async (client, player, track) => {
  const channel = client.channels.cache.get(player.textChannelId);
  const cut = (title) => {
    title = title.length > 46 ? title.substring(0, 46) : title;
    return title.toLowerCase();
  };

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
