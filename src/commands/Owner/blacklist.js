const { MessageEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");
const { getter } = require("../../utils/emojis");

exports.run = async (client, message, args) => {
  if (message.author.id !== process.env.ownerId) return;

  //-------------------BASE VARIABLES----------------------//
  const shield = new getter(client).get("shield").url;
  const reason = args[2] ? args.slice(2).join(" ") : "Não definido";

  const user =
    client.users.cache.get(args[0]) || message.mentions.users.first();
  const { Black } = client.database;
  //-------------------------------------------------------//

  //--------------------BAN AND UNBAN----------------------//
  if (args[0]) {
    if (!user) {
      return message.reply("Esse usuário não existe!");
    } else if ([process.env.ownerId, client.user.id].includes(args[0])) {
      return message.reply("Impossível!");
    }

    const userData = await Black.findById(user.id);

    if (userData) {
      await Black.deleteOne({ _id: user.id });
      return message.reply(
        `O usuário **${user.tag}** foi **retirado** da blacklist com sucesso!`
      );
    } else {
      await Black.create({ _id: user.id, reason });
      return message.reply(
        `O usuário **${user.tag}** foi **colocado** na minha blacklist!`
      );
    }
  }
  //-------------------------------------------------------//

  //-----------------------EMBED--------------------------------//
  const users = await Black.find();

  if (!users[0]) {
    return message.reply(
      "Não há nenhum usuário na minha blacklist :raised_hands:"
    );
  }

  const description = [];

  for (const doc of users) {
    const sucker = client.users.cache.get(doc._id);

    const subDescription = stripIndents`
      > **Nome:** ${sucker.tag}
      > **Motivo:** ${doc.reason}
      > **Desde:** <t:${Math.ceil(doc.date.getTime() / 1000)}:f>
      `;

    description.push(subDescription);
  }

  const embed = new MessageEmbed()
    .setAuthor({ name: "Blacklist", iconURL: shield })
    .setDescription(description.join("\n\n"))
    .setColor(process.env.colorEmbed);

  message.reply({
    embeds: [embed],
  });
  //-------------------------------------------------------------//
};

exports.help = {
  name: "blacklist",
  description: "Veja|adicione|remova usuários na blacklist",
  aliases: ["black"],
  usage: "blacklist <user|id>",
  category: "Owner",
};
