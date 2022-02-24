const { MessageEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");
const { getter } = require("../../utils/emojis");

exports.run = async (client, message) => {
  const { User } = client.database;
  const embed = new MessageEmbed().setColor(process.env.colorEmbed);
  const emojiLoading = new getter(client).get("loading");

  const startTime = process.hrtime();
  await User.findById(message.author.id);
  const stopTime = process.hrtime(startTime);

  const pingDB = Math.round((stopTime[0] * 1e9 + stopTime[1]) / 1e6) + "ms";
  const m = await message.reply({
    embeds: [embed.setDescription(`${emojiLoading}`)],
  });

  const pings = stripIndents`
  🏓 **|** Ping do bot: ${client.ws.ping}ms
  📡 **|** Latência do servidor: ${
    m.createdTimestamp - message.createdTimestamp
  }ms
  :leaves: **|** Ping da database: ${pingDB}
  `;

  await m.edit({
    embeds: [embed.setDescription(pings)],
  });
};

module.exports.help = {
  name: "ping",
  description: "Veja os meus pings",
  aliases: ["pong", "ws", "ping-pong"],
  usage: "ping",
};
