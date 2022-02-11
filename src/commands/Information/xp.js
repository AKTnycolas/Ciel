const { MessageEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");

exports.run = async (client, message, args, { user }) => {
  const { level, xp, nextLevel } = user.exp;
  
  const embed = new MessageEmbed()
    .setDescription(stripIndents`
    Level: **${level}**
    Total: **${xp}**
    Falta: **${nextLevel}**
    `)
    .setColor(process.env.colorEmbed);

  await message.reply({ embeds: [embed] });
};

module.exports.help = {
  name: "xp",
  description: "Veja o seu xp",
  aliases: ["experiencia"],
  usage: "xp",
  category: "Information",
};
