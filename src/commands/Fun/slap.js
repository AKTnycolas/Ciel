const { MessageEmbed } = require("discord.js");

exports.run = async (client, message, args) => {
  const { Image } = client.database;
  const author = message.author;
  const somebody = message.mentions.users.first();

  if (!somebody) return message.reply("Você precisa mencionar um usuário!");
  if (somebody.id === author.id)
    return message.reply("Você não pode bater em si mesmo!, epa espera ai...");

  const doc = await Image.findById("slap");
  let images = doc?.images;
  
  if (!images || images.length === 0)
    images = ["https://imgur.com/UOsp0hC.gif"];
  const chosenImage = images[Math.floor(Math.random() * images.length)];

  const embed = new MessageEmbed()
    .setDescription(`${author} acabou de dá um tapa em ${somebody}`)
    .setImage(chosenImage)
    .setColor(process.env.colorEmbed);

  await message.reply({
    embeds: [embed],
  });
};

module.exports.help = {
  name: "slap",
  description: "De um tapa em um usuário",
  aliases: ["tapa", "tampao"],
  usage: "slap [user]",
};
