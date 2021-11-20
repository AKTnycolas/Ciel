const { Permissions, MessageEmbed } = require("discord.js");
const Emojis = require("../../utils/emojis");
const Guild = require("../../database/Schemas/Guild");

exports.run = async (client, message, args, { server }) => {
  
  //---------------------BASIC VARIABLES-------------------------// 
  const administrator = message.guild.members.cache
    .get(message.author.id)
    .permissions.has(Permissions.FLAGS.ADMINISTRATOR);

  const prefix = args[0];
  
  const setupEmoji = client.emojis.cache.get(Emojis.edited).url;
  const embed = new MessageEmbed()
    .setAuthor("Prefix", setupEmoji)
    .setColor(process.env.colorEmbed);
  
  const send = async (text) => {
    embed.setDescription(text);
    await message.reply({
      embeds: [embed]
    });
  };
  //-------------------------------------------------------------//
  
  
  //--------------IF THE USER HAS NOT PUT ANYTHING---------------// 
  if (!args[0]) {
    send(`Olá, o meu prefix nesse servidor é __**${server.prefix}**__`);
    return;
  }
  //-------------------------------------------------------------// 
  
  
  //-----------------IF YOU WANT TO RESET THE PREFIX--------------------//
  else if (["reset", "default", "pattern"].includes(args[0])) {
    if (administrator) {
      if (server.prefix == process.env.basePrefix) {
        send("Esse prefixo já está setado");
      } else {
        send("O prefix do servidor foi resetado para o prefixo padrão");
        await Guild.findOneAndUpdate(
          { _id: message.guild.id },
          { $set: { prefix: process.env.basePrefix } }
        );
      }
    } else {
      send("⚠️ Você não tem permissão para executar esse comando ⚠️");
    }
  }
  
  //-----------------IF YOU PUT THE PREFIX--------------------//
  
  else if (args[0]) {
    if (administrator) {

      if (prefix.length > 5)
        return send(
          `O tamanho do prefix é muito grande, a quantidade máxima é **5** caracteres`
        );
      else if (prefix === server.prefix)
        return send(
          `O prefix escolhido é mesmo já setado na database!`
        );
      else {
        await Guild.findOneAndUpdate({ _id: message.guild.id }, { $set: { prefix: prefix } })
          .then(send(
              `O prefix do servidor foi alterado com sucesso, agora o novo prefix é **${prefix}**`
          ))
          .catch(err => {
            send("Não foi possivel trocar o prefix, pois ocorreu algum error interno");
            console.log(err);
          });
      }
      return;
      
    //-------------------------------------------------------------//
    } else send("⚠️ Você não tem permissão para executar esse comando ⚠️");
  }
}

module.exports.help = {
  name: "prefix",
  description: "Altere o meu prefixo",
  aliases: ["prefixo", "reset-prefix"],
  usage: "prefix <prefixo || reset>",
  category: "Config"
};