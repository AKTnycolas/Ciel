const { MessageEmbed } = require("discord.js");

exports.run = async (client, message, args) => {
  const options = ["cara", "coroa"];
  const winner = Math.floor(Math.random() * 2);
  const chosenOption = args[0]?.toLowerCase();
  let result;

  if (!chosenOption || (chosenOption !== "cara" && chosenOption !== "coroa")) {
    result = "insira **cara** ou **coroa** na frente do comando.";
  } else if (chosenOption == options[winner]) {
    result = "Deu **" + options[winner] + "**, você ganhou dessa vez!";
  } else if (args[0].toLowerCase() !== options[winner]) {
    result = "Deu **" + options[winner] + "**, você perdeu dessa vez!";
  }

  const embed = new MessageEmbed()
    .setDescription(result)
    .setColor(process.env.colorEmbed);

  await message.reply({ embeds: [embed] });
};

module.exports.help = {
  name: "coinflip",
  description: "jogue cara ou coroa",
  aliases: ["cara", "coroa", "caraoucoroa"],
  usage: "coinflip <cara|coroa>",
};
