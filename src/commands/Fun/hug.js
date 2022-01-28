const { MessageEmbed } = require("discord.js");
const Image = require("../../database/Schemas/Image.js");

exports.run = async (client, message, args) => {
  const author = message.author;
  const somebody = message.mentions.users.first();

  if (!somebody) return message.reply("Você precisa mencionar um usuário!");
  if (somebody.id === author.id)
    return message.reply("Você não pode abraça a si mesmo!, epa espera ai...");

  const doc = await Image.findById("hug");
  let images = doc?.images;
  if (!images || images.length === 0) images = ["https://imgur.com/sPtJzYA.gif"];

  const chosenImage = images[Math.floor(Math.random() * images.length)];

  const embed = new MessageEmbed()
    .setDescription(`${author} acabou de dá um abraço em ${somebody}`)
    .setImage(chosenImage)
    .setColor(process.env.colorEmbed);

  await message.reply({
    embeds: [embed],
  });
};

module.exports.help = {
  name: "hug",
  description: "Abrace um usuário",
  aliases: ["abracar", "abraco"],
  usage: "hug [user]",
  category: "Fun",
};
