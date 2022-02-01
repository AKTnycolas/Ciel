const { MessageEmbed } = require("discord.js");
const lovePercentage = require("../../utils/plugins/getLovePercentage.js");

exports.run = async (client, message, args) => {
  const { Image } = client.database;
  const author = message.author;
  const somebody = message.mentions.users.first();

  if (!somebody) return message.reply("Você precisa mencionar um usuário!");
  if (somebody.id === author.id)
    return message.reply("Você não pode beijar a si mesmo!");

  const doc = await Image.findById("kiss");
  let images = doc?.images;
  if (!images || images.length === 0)
    images = ["https://imgur.com/5uH8BvY.gif"];

  const chosenImage = images[Math.floor(Math.random() * images.length)];
  const percent = lovePercentage(author.username, somebody.username);

  const embed = new MessageEmbed()
    .setDescription(
      `${author} e ${somebody} a chances de vocês são de ${percent}%`
    )
    .setImage(chosenImage)
    .setColor(process.env.colorEmbed);

  await message.reply({
    embeds: [embed],
  });
};

module.exports.help = {
  name: "kiss",
  description: "Beije um usuário ( ͡° ͜ʖ ͡°)",
  aliases: ["beijar", "beijo"],
  usage: "kiss [user]",
  category: "Fun",
};
