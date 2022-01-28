const { MessageEmbed } = require("discord.js");
const weather = require("weather-js");

exports.run = async (client, message, args) => {
  const city = args.join(" ").toLowerCase();
  if (!city) return message.reply("Você não disse o nome da cidade/estado!");

  weather.find({ search: city, degreeType: "C" }, function (err, result) {
    if (err || !result[0])
      return message.reply("Desculpa, mas não consegui achar a cidade");

    const data = result[0];

    const embed = new MessageEmbed()
      .setAuthor({ name: data.location.name, iconURL: data.current.imageUrl })
      .setThumbnail(data.current.imageUrl)
      .addField("Temperatura: ", `${data.current.temperature}°C`)
      .addField("Sensação Térmica: ", `${data.current.feelslike}°C`)
      .addField("Umidade: ", `${data.current.humidity}%`)
      .addField("Velocidade do Vento: ", data.current.windspeed)
      .setColor(process.env.colorEmbed);

    message.reply({
      embeds: [embed],
    });
  });
};

module.exports.help = {
  name: "clima",
  description: "Veja a previsão do tempo de uma cidade ou estado",
  aliases: ["climate", "forecast"],
  usage: "clima [cidade|estado]",
  category: "Information",
};
