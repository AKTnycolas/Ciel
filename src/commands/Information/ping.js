const { MessageEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");
const { loading } = require("../../utils/emojis");

exports.run = async (client, message, args) => {
  const embed = new MessageEmbed().setColor(process.env.colorEmbed);
  const emojiCarrying = client.emojis.cache.get(loading);

  const m = await message.reply({
    embeds: [embed.setDescription(`${emojiCarrying}`)]
  });

  const pings = stripIndents`
  🏓 **|** Ping do bot: ${client.ws.ping}ms
  📡 **|** Latência do servidor: ${m.createdTimestamp -
    message.createdTimestamp}ms
  `;

  await m.edit({ embeds: [embed.setDescription(pings)] });
};

module.exports.help = {
  name: "ping",
  aliases: ["pong", "ws", "ping-pong"]
};
