const { MessageEmbed } = require("discord.js");
const { parseIn } = require("../../utils/plugins/dates.js");

exports.run = async (client, message, args) => {
  const timeAwake = parseIn(client.readyAt);

  const embed = new MessageEmbed()
    .setDescription(`Estou online já faz ${timeAwake}`)
    .setColor(process.env.colorEmbed);

  await message.reply({ embeds: [embed] });
};

module.exports.help = {
  name: "uptime",
  description: "Veja quanto tempo estou online",
  aliases: ["tempoatividade", "upt"],
  usage: "uptime",
  category: "Information",
};
