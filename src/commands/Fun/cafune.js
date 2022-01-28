const { MessageEmbed } = require("discord.js");
const Image = require("../../database/Schemas/Image.js");

exports.run = async (client, message, args) => {
  const author = message.author;
  const somebody = message.mentions.users.first();

  if (!somebody) return message.reply("Você precisa mencionar um usuário!");
  if (somebody.id === author.id)
    return message.reply(
      "Você não pode fazer um cafuné em si mesmo!, epa espera ai..."
    );
  
  const doc = await Image.findById("cafune");
  let images = doc?.images;
  if (!images || images.length === 0) images = ["https://imgur.com/gQOmBgC.gif"];
  
  const chosenImage = images[Math.floor(Math.random() * images.length)];

  const embed = new MessageEmbed()
    .setDescription(`${author} acabou de fazer um cafuné em ${somebody}`)
    .setImage(chosenImage)
    .setColor(process.env.colorEmbed);

  await message.reply({
    embeds: [embed],
  });
};

module.exports.help = {
  name: "cafune",
  description: "Faça um cafuné em um usuário",
  aliases: ["carinho", "kindness"],
  usage: "cafune [user]",
  category: "Fun",
};
