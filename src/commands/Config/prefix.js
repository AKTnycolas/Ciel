const { Permissions } = require("discord.js");
const Guild = require("../../database/Schemas/Guild");

exports.run = async (client, message, args, { server }) => {
  const administrator = message.guild.members.cache
    .get(message.author.id)
    .permissions.has(Permissions.FLAGS.ADMINISTRATOR);

  const prefix = args[0];

  if (!args[0]) {
    return message.reply(
      `Olá ${message.author.username}, o meu prefix nesse servidor é **${server.prefix}**`
    );
  }
  
  //-----------------IF YOU WANT TO RESET THE PREFIX--------------------//
  
  else if (["reset", "default", "pattern"].includes(args[0])) {
    if (administrator) {
      if (server.prefix == process.env.basePrefix) {
        message.reply("esse prefixo já está setado atualmente");
      } else {
        message.reply(
          "O prefix do servidor foi resetado para o prefixo padrão"
        );
        await Guild.findOneAndUpdate(
          { _id: message.guild.id },
          { $set: { prefix: process.env.basePrefix } }
        );
      }
    } else {
      message.reply("⚠️ você não tem permissão para executar esse comando ⚠️");
    }
  }
  
  //-----------------IF YOU PUT THE PREFIX--------------------//
  
  else if (args[0]) {
    if (administrator) {

      if (prefix.length > 5)
        return message.reply(
          `O tamanho do prefix é muito grande, a quantidade máxima é **5** caracteres`
        );
      else if (prefix === server.prefix)
        return message.reply(
          `O prefix escolhido é mesmo já setado na database!`
        );
      else {
        await Guild.findOneAndUpdate({ _id: message.guild.id }, { $set: { prefix: prefix } })
          .then(message.reply(
              `O prefix do servidor foi alterado com sucesso, agora o novo prefix é **${prefix}**`
          ))
          .catch(err => {
            message.reply("Não foi possivel trocar o prefix, pois ocorreu algum error interno");
            console.log(err);
          });
      }
      return;
    } else message.reply("⚠️ você não tem permissão para executar esse comando ⚠️");
  }
}

module.exports.help = {
  name: "prefix",
  description: "Altere o meu prefixo",
  aliases: ["prefixo", "reset-prefix"],
  usage: "<prefix>prefix\n<prefix>prefix [prefixo]\n<prefix>prefix reset",
  category: "Config"
};
