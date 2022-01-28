const { MessageEmbed, Permissions } = require("discord.js");
const Guild = require("../../database/Schemas/Guild");
const { stripIndents } = require("common-tags");
const Emojis = require("../../utils/emojis");

exports.run = async (client, message, args) => {
  const administrator = message.guild.members.cache
    .get(message.author.id)
    .permissions.has([
      Permissions.FLAGS.ADMINISTRATOR,
      Permissions.FLAGS.MANAGE_MESSAGES,
    ]);

  if (administrator === false) {
    return message.reply(stripIndents`
      Sinto muito mas para você executar o comando você precisa
      ser administrador ou tem uma permissão de gerenciar
      mensagens`);
  } else {
    const server = await Guild.findById(message.guild.id);

    if (server.antieveryone) {
      await Guild.findByIdAndUpdate(
        server._id,
        { "$set": { antieveryone: false } }
      );
    } else {
      await Guild.findByIdAndUpdate(
        server._id,
        { "$set": { antieveryone: true } }
      );
    }
    
    const toggle = server.antieveryone.toString()
      .replace("true", "desativado")
      .replace("false", "ativado");
    
    const embed = new MessageEmbed()
      .setDescription(`O sistema antieveryone foi **${toggle}** com sucesso`)
      .setColor(process.env.colorEmbed);
    
    return message.reply({
      embeds: [embed],
      ephemeral: true
    });
  }
};

module.exports.help = {
  name: "antieveryone",
  description: "Ligue ou desligue o sistema antieveryone",
  aliases: ["everyone"],
  usage: "antieveryone",
  category: "Config",
};
