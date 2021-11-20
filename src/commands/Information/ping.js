const { MessageEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");
const Emojis = require("../../utils/emojis");
const User = require("../../database/Schemas/User");

exports.run = async (client, message, args) => {
  const embed = new MessageEmbed().setColor(process.env.colorEmbed);
  const emojiLoading = client.emojis.cache.get(Emojis.loading);
  
  const startTime = process.hrtime();
  await User.findOne({ _id: message.author.id }, (err, user) => {});
  const stopTime = process.hrtime(startTime);

  const pingDB = Math.round((stopTime[0] * 1e9 + stopTime[1]) / 1e6) + "ms";  

  const m = await message.reply({
    embeds: [embed.setDescription(`${emojiLoading}`)]
  });
  
  const pings = stripIndents`
  🏓 **|** Ping do bot: ${client.ws.ping}ms
  📡 **|** Latência do servidor: ${m.createdTimestamp -
    message.createdTimestamp}ms
  :leaves: **|** Ping da database: ${pingDB}
  `;

  await m.edit({
    embeds: [embed.setDescription(pings)]
  });
};

module.exports.help = {
  name: "ping",
  description: "Veja os meus pings",
  aliases: ["pong", "ws", "ping-pong"],
  usage: "ping",
  category: "Information"
};
