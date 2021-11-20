const { MessageEmbed } = require("discord.js");
const Emojis = require("../../utils/emojis");

exports.run = async (client, message, args) => {
  // a basic check.
  if (!args[0]) 
    return message.reply("Você não colocou o motivo!");
  
  //--------------------------VARIABLES--------------------------// 
  const icon = message.author.displayAvatarURL({ dynamic: true })
  const bug = client.emojis.cache.get(Emojis.no).url;
  
  const channel = client.channels.cache.get(process.env.bugChannel);
  const reason = args.join(" ");
  //-------------------------------------------------------------// 
  
  
  //---------------------------EMBED-----------------------------// 
  const embed = new MessageEmbed()
    .setAuthor("Mais um bug encontrado", bug)
    .setThumbnail(icon)
    .addField("Autor: ", message.author.tag)
    .addField("Servidor: ", message.guild.name)
    .addField("Motivo: ", `${reason}`)
    .setColor(process.env.colorEmbed)
    .setTimestamp();
  
  await channel.send({
    embeds: [embed]
  });
  
  await message.reply("Ok, o seu report foi enviado com sucesso.");
  //-------------------------------------------------------------//
};

exports.help = {
  name: "bugreport",
  description: "Use esse comando para reportar bugs do bot",
  aliases: ["bug", "report"],
  usage: "bugreport [motivo]",
  category: "Utils"
};
