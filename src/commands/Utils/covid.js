const { MessageEmbed } = require("discord.js");

exports.run = async (client, message, args) => {
  const country = args[0];
  const baseUrl = "https://corona.lmao.ninja/v2";
  const url = country ? `${baseUrl}/countries/${country}` : `${baseUrl}/all`;

  const data = await fetch(url)
    .then((res) => res.json())
    .then((res) => res);

  if (data.message) {
    return message.reply("País não encontrado ou sem casos");
  }

  const embed = new MessageEmbed()
    .setTitle(country
      ? `Status da covid-19 no ${country}`
      : "Status da covid-19 pelo mundo"
    )
    .setThumbnail(country
      ? data.countryInfo.flag
      : "https://imgur.com/csEMCYe.png"
    )
    .setColor(process.env.colorEmbed)
    .addField("Total de casos:", data.cases.toLocaleString())
    .addField("Mortes:", data.deaths.toLocaleString())
    .addField("Recuperados:", data.recovered.toLocaleString())
    .addField("Casos ativos:", data.active.toLocaleString())
    .addField("Casos críticos:", data.critical.toLocaleString())
    .addField("Recuperados de hoje:", data.todayRecovered.toLocaleString().replace("-", ""))
    .addField("Mortes hoje:", data.todayDeaths.toLocaleString());

  message.reply({
    embeds: [embed],
  });
  //-------------------------------------------------------------//
};

exports.help = {
  name: "covid",
  description: "Veja os status da covid-19 pelo mundo",
  aliases: ["covid-19", "corona"],
  usage: "covid [<país>](https://www.sport-histoire.fr/pt/Geografia/Codigos_ISO_Paises.php)",
};
