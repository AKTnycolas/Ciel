const { MessageEmbed } = require("discord.js");
const abrev = require("../../utils/plugins/abbrev");

exports.run = async (client, message) => {
  const { User } = client.database;
  const author = message.mentions.users.first() || message.author;
  const user = await User.findById(author.id);

  if (!user)
    return message.reply(
      `O usuário ${author} ainda não está na minha database!`
    );

  const balance = user.balance;

  const embed = new MessageEmbed()
    .setAuthor({ name: `Saldo de ${author.tag}` })
    .setThumbnail(author.displayAvatarURL({ dynamic: true }))
    .addField(":coin: Carteira: ", `${abrev(balance.coins)} coins`)
    .addField(":bank: Banco: ", `${abrev(balance.bank)} coins`)
    .setColor(process.env.colorEmbed);

  message.reply({ embeds: [embed] });
};

exports.help = {
  name: "atm",
  description: "Veja o seu saldo",
  aliases: ["saldo", "carteira", "balance"],
  usage: "atm <user>",
};
