exports.run = async (client, message, args) => {
  //------------------BASE VARIABLES----------------------//
  const guild = message.guild;
  const author = guild.members.cache.get(message.author.id);

  let member =
    guild.members.cache.get(args[0]) || message.mentions.members.first();
  member = guild.members.cache.get(member?.id);
  let reason = args[1] ? args.slice(1).join(" ") : "Não definido";
  //-------------------------------------------------------//

  //------------------PERMISSION VERIFICATION----------------------//
  if (!member || member.id === author.id) {
    return message.reply(
      "Você deve mencionar/inserir o id do usuário a ser banido!"
    );
  } else if (!member.bannable) {
    return message.reply(
      "Não foi possível banir esse usuário, pois ele tem um cargo maior que o meu"
    );
  }
  //-------------------------------------------------------//

  //------------------BAN---------------------------------//
  member
    .ban({ days: 7, reason: reason })
    .then((kick) => {
      const tag = kick.user?.tag ?? kick.tag ?? kick;
      message.reply(`O usuário ${tag} foi banido com sucesso!`);
    })
    .catch((err) => {
      message.reply("Aconteceu algum error ao tentar banir esse usuário!");
      console.error(err);
    });
  //-------------------------------------------------------//
};

module.exports.help = {
  name: "ban",
  description: "bane um usuário",
  aliases: ["banir"],
  usage: "ban [menção|id]",
  permissions: ["BAN_MEMBERS"],
  category: "Moderation",
};
