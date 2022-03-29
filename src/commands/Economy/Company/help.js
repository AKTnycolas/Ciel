const { notifier } = require("../../../utils/plugins/notifier");
const { MessageEmbed } = require("discord.js");
const { readdirSync } = require("fs");

async function help(client, message) {
  try {
    const subs = await readdirSync(__dirname).map((x) => x.split(".")[0]);

    const embed = new MessageEmbed()
      .setDescription(
        `Esses são todos os subs comandos: \`\`\`\n${subs.join(" - ")}\n\`\`\``)
      .setColor(process.env.colorEmbed);

    return message.reply({
      embeds: [embed],
    });
  } catch (err) {
    notifier(client, "Comando Com Error", err);
    message.reply("Aconteceu algum error ao tentar usar o comando!");
  }
}

module.exports = help;
