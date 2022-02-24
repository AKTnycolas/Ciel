const { MessageEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");

exports.run = async (client, message) => {
  const users = await client.database.User.find();
  /*
  const removePoor =
    users.filter((a) => a.balance.coins + a.balance.bank > 50);
  */

  const get = (id) => client.users.cache.get(id);

  const tops = users
    .sort((x, y) =>
      (y.balance.coins + y.balance.bank) - (x.balance.coins + x.balance.bank)
    )
    .slice(0, 10);

  let description = "";

  const embed = new MessageEmbed()
    .setTitle("Rank de coins")
    .setColor(process.env.colorEmbed);

  for (const user of tops) {
    description += `> **${get(user._id).tag}** | coins: **${
      user.balance.coins + user.balance.bank
    }**\n`;
  }

  embed.setDescription(stripIndents`${description}`);

  return message.reply({ embeds: [embed] });
};

exports.help = {
  name: "rank",
  description: "Veja o rank de coins",
  aliases: ["top", "rankcoins"],
  usage: "rank",
};
