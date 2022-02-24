const { MessageEmbed } = require("discord.js");

exports.run = async (client, message, args) => {
  const send = (text) => {
    const embed = new MessageEmbed()
      .setDescription(text)
      .setColor(process.env.colorEmbed);

    message.reply({ embeds: [embed] });
  };

  if (!args[0]) return send("Você não disse qual é o usuário!");

  const user = message.mentions.users.first();

  if (!user) 
    return send("Você não mencionou o usuário!");
  else if (user.id === message.author.id)
    return send("Acredito que você já sabe a resposta");
  else if (!user) return send("Esse usuário não foi encontrado!");

  const presence = message.guild.presences.cache.get(user.id);
  
  if (presence)
    return send("Pelo que tudo indica esse usuário está online.");
  else
    return send("Pelo que parece esse usuário realmente está offline.");
};

module.exports.help = {
  name: "liar",
  description: "Veja se o usuário mentiu que saiu do discord",
  aliases: ["fakeexit"],
  usage: "liar [user]",
};
