const { MessageEmbed } = require("discord.js")
const { stripIndents } = require("common-tags");
const Emojis = require("../emojis");

module.exports = {
  async notifier(client, type, err) {
    //-------------------------VARIABLES---------------------------//
    const channel = client.channels.cache.get(process.env.errChannel);
    const get = id => client.emojis.cache.get(id);

    let color;
    switch (type) {
      case "Comando Com Error": color = "#FF0000"; break;
      case "Rejeição Não Tratada": color = "#FF8C00"; break;
      case "Error de Sintaxe": color = "#6600FF"; break;
      case "Database Error": color = "#90EE90"; break;
      default: color = process.env.colorEmbed; break;
    }

    const dateOfOccurrence = `<t:${Math.ceil(Date.now()/ 1000)}:f>`;

    let error = err?.stack ?? err.message;
    error = error.length > 1002 ? error.slice(0, 1002) + "..." : error;
    error = `\`\`\`js\n${stripIndents(error)}\`\`\``;
    //-------------------------------------------------------------//

    console.log(err);

    //-------------------------EMBED-------------------------------//
    const embed = new MessageEmbed()
      .setAuthor({ name: "Error Encotrado", iconURL: get(Emojis.bug).url })
      .addField(":date: Data do Ocorrido: ", dateOfOccurrence)
      .addField(`${get(Emojis.pag)} Tipo de Error: `, type)
      .addField(`${get(Emojis.wrong_theme_2)} Error: `, error)
      .setColor(color);

    await channel.send({
      embeds: [embed]
    });
    //-------------------------------------------------------------//
  }
};
