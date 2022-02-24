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

  const data = [];
  const tracks = player.queue.slice(0, 7);
  const cut = (title) => {
    const sub = title.length > 46 ? (title.substring(0, 46) + "...") : title;
    return sub.toLowerCase();
  };

  let current = 0;

  for (const track of tracks) {
    data.push(`${current + 1}° - [${cut(track.title)}](${track.uri})`);
    current++;
  }

  if (player.queue.length > 7)
    data.push(`e mais ${player.queue.length - tracks.length} músicas.`);

  const playing = stripIndents`
  > Título: [${cut(player.current.title)}](${player.current.uri})
  > Author: **${player.current.author}**
  > Requisitado Por: ${player.current.requester}
  > Duração: **${cooldown(new Date(player.current.duration))}**
  `;

  const embed = new MessageEmbed()
    .setDescription(data.join("\n"))
    .addField("Tocando Agora: ", playing)
    .setColor(process.env.colorEmbed);

  message.reply({ embeds: [embed] });
};

exports.help = {
  name: "queue",
  description: "Veja a lista de músicas",
  aliases: ["lista", "fila", "playlist"],
  usage: "queue",
};
