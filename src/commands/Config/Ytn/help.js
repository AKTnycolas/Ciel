const { MessageEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");

async function help(client, message, {}, { server }) {
  const prefix = server.prefix;
  
  const description = stripIndents`
  > ${prefix}ytn addurl <link> <canal> - adiciona um canal
  > ${prefix}ytn removeurl - remove um canal
  > ${prefix}ytn message - altera a mensagem de um canal
  `;
  
  const embed = new MessageEmbed()
    .setTitle("Todos os subcomandos e como usar:")
    .setDescription(description)
    .setColor(process.env.colorEmbed);

  message.reply({ embeds: [embed] });
}

module.exports = help;
