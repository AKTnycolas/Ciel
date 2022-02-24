const { MessageEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");
const { cooldown } = require("../../utils/plugins/dates");

exports.run = async (client, message) => {
  const nodes = client.vulkava.nodes;
  const embed = new MessageEmbed().setColor(process.env.colorEmbed);
  
  for (const node of nodes) {
    embed.addField(node.options.id, stripIndents`
    > Status: ${replace(node.state)}
    > Players: ${node.stats.players}
    > Uptime: ${cooldown(new Date(node.stats.uptime))}
    `
    );
  }

  message.reply({ embeds: [embed] });

  function replace(num) {
    num = num.toString()
      .replace("0", "reconectando")
      .replace("1", "ativado")
      .replace("2", "desativado");

    return num;
  }
};

exports.help = {
  name: "nodes",
  description: "Veja os status dos nodes do lavalink",
  aliases: ["node", "lavalink"],
  usage: "nodes",
};
