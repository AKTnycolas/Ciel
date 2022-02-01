const { MessageEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");
const { getter } = require("../emojis");

module.exports = {
  async notifier(client, type, err) {
    //-------------------------VARIABLES---------------------------//
    const Emojis = new getter(client);
    const { webhookUrl } = process.env;
    const username = client.user.username;
    const avatar = client.user.displayAvatarURL({ dynamic: false });

    let color;
    switch (type) {
      case "Comando Com Error":
        color = "#FF0000";
        break;
      case "Rejeição Não Tratada":
        color = "#FF8C00";
        break;
      case "Error de Sintaxe":
        color = "#6600FF";
        break;
      case "Database Error":
        color = "#90EE90";
        break;
      case "Rejeição Tradada":
        color = "#BCD2EE";
        break;
      default:
        color = process.env.colorEmbed;
        break;
    }
    const dateOfOccurrence = `<t:${Math.ceil(Date.now() / 1000)}:f>`;

    let error = err?.stack ?? err.message;
    error = error.length > 1002 ? error.slice(0, 1002) + "..." : error;
    error = `\`\`\`js\n${stripIndents(error)}\`\`\``;
    //-------------------------------------------------------------//
    console.log(err);
    //-------------------------EMBED-------------------------------//
    const embed = new MessageEmbed()
      .setAuthor({ name: "Error Encotrado", iconURL: Emojis.get("bug").url })
      .addField(":date: Data do Ocorrido: ", dateOfOccurrence)
      .addField(`${Emojis.get("pag")} Tipo de Error: `, type)
      .addField(`${Emojis.get("wrong_theme_2")} Error: `, error)
      .setColor(color);

    await fetch(webhookUrl, {
      method: "POST",
      body: JSON.stringify({
        username,
        avatar,
        embeds: [embed],
      }),
      headers: {"Content-type": "application/json"}
    });
    //-------------------------------------------------------------//
  },
};
