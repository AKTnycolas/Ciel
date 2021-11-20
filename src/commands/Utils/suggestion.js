const { MessageEmbed } = require("discord.js");
const Emojis = require("../../utils/emojis");

exports.run = async (client, message, args) => {
  // a basic check.
  if (!args[0]) 
    return message.reply("Você não colocou a sua sugestão!");
  
  //--------------------------VARIABLES--------------------------// 
  const icon = message.author.displayAvatarURL({ dynamic: true })
  const ok = client.emojis.cache.get(Emojis.yes).url;
  
  const channel = client.channels.cache.get(process.env.sugChannel);
  const suggestion = args.join(" ");
  //-------------------------------------------------------------// 
  
  
  //---------------------------EMBED-----------------------------// 
  const embed = new MessageEmbed()
    .setAuthor("Mais uma sugestão", ok)
    .setThumbnail(icon)
    .addField("Autor: ", message.author.tag)
    .addField("Servidor: ", message.guild.name)
    .addField("Sugestão: ", `${suggestion}`)
    .setColor(process.env.colorEmbed)
    .setTimestamp();
  
  await channel.send({
    embeds: [embed]
  });
  
  await message.reply("Ok, a sua sugestão foi enviado com sucesso.");
  //-------------------------------------------------------------//
};

exports.help = {
  name: "suggestion",
  description: "Use esse comando para sugerir algo",
  aliases: ["sug", "sugestão"],
  usage: "suggestion [sugestão]",
  category: "Utils"
};
