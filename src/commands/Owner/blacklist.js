const { MessageEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");
const Black = require("../../database/Schemas/Black");
const Emojis = require("../../utils/emojis");

exports.run = async (client, message, args) => {
  if (message.author.id !== process.env.ownerId) return;
  const get = (id) => client.emojis.cache.get(id);

  //-----------------------ADD USER-----------------------------//
  if (["add", "adicionar"].includes(args[0])) {
    if (!args[1]) {
      return message.reply("Você não disse o id do user!");
    } else if (!client.users.cache.get(args[1])) {
      return message.reply("Esse usuário não existe!");
    } else if ([process.env.ownerId, client.user.id].includes(args[1])) {
      return message.reply("Impossível!");
    }

    const reason = args[2] ? args.slice(2).join(" ") : "Não definido";
    const user = await Black.findById(args[1]);

    if (user) {
      return message.reply("Esse usuário já está na minha blacklist!");
    } else {
      await Black.create({ _id: args[1], reason });
      return message.reply(
        `O usuário de id **${args[1]}** foi **banido** com sucesso!`
      );
    }
  }
  //-------------------------------------------------------//
  
  //-------------------REMOVING USER-----------------------//
  if (["rmv", "remove"].includes(args[0])) {
    if (!args[1]) {
      return message.reply("Você não disse o id do user!");
    }

    const reason = args[2] ? args.slice(2).join(" ") : "Não definido";
    const user = await Black.findById(args[1]);

    if (!user) {
      return message.reply("Esse usuário não está na minha database!");
    } else {
      await Black.deleteOne({ _id: user._id });
      return message.reply(
        `O usuário de id **${args[1]}** **foi retirado** da blacklist com sucesso!`
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

  for (let doc of users) {
    const user = client.users.cache.get(doc._id);

    const subDescription = stripIndents`
      > **Nome:** ${user.tag}
      > **Motivo:** ${doc.reason}
      > **Desde:** <t:${Math.ceil(doc.date.getTime() / 1000)}:f>
      `;

    description.push(subDescription);
  }

  const embed = new MessageEmbed()
    .setAuthor({ name: "Blacklist", iconURL: get(Emojis.shield).url })
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
  usage: "blacklist <id>",
  category: "Owner",
};
