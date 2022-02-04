const { MessageEmbed, Util } = require("discord.js");
const { getter } = require("../../utils/emojis");

module.exports = async (client, message) => {
  //---------------------BASE CHECK------------------------//
  if (message.author.bot) return;
  else if (message.channel.type === "dm") return;
  //-------------------------------------------------------//

  //--------------------BASE VARIABLES---------------------//
  const Emojis = new getter(client);
  const { Guild } = client.database;
  const server = await Guild.findById(message.guild.id);
  //-------------------------------------------------------//

  //------------------------EMBED--------------------------//
  if (server.logs.toggle) {
    const channel = client.channels.cache.get(server.logs.channel);

    const embed = new MessageEmbed()
      .setAuthor({
        name: "Mensagem Deletada",
        iconURL: Emojis.get("trash").url,
      })
      .addField("Autor: ", message.author.toString())
      .addField("Canal: ", `<#${message.channelId}>`)
      .addField(
        "Mensagem: ",
        Util.cleanCodeBlockContent(message.content.substring(0, 220))
      )
      .setColor(process.env.colorEmbed);

    try {
      await channel.send({
        embeds: [embed],
      });
    } catch (err) {}
  }
  //-------------------------------------------------------//
};
