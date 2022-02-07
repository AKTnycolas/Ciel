exports.run = async (client, message, args) => {
  //------------------BASE VARIABLES----------------------//
  const guild = message.guild;
  const author = guild.members.cache.get(message.author.id);

  const user = client.users.cache.get(args[0]);
  const reason = args[1] ? args.slice(1).join(" ") : "Não definido";
  const ban = guild.bans.cache.get(args[0]);
  //-------------------------------------------------------//

  //------------------PERMISSION VERIFICATION----------------------//
  if (!user || user.id === author.id) {
    return message.reply("Você deve inserir o id do usuário a ser desbanido!");
  } else if (!ban) {
    return message.reply("Esse usuário não está banido!");
  }
  //-------------------------------------------------------//

  //------------------BAN---------------------------------//
  guild.members
    .unban(user.id, reason)
    .then(() => {
      message.reply(`O usuário ${user.tag} foi desbanido com sucesso!`);
    })
    .catch((err) => {
      message.reply("Aconteceu algum error ao tentar desbanir esse usuário!");
      console.error(err);
    });
  //-------------------------------------------------------//
};

module.exports.help = {
  name: "unban",
  description: "Desbane um usuário",
  aliases: ["banir"],
  usage: "unban [id]",
  permissions: ["BAN_MEMBERS"],
  category: "Moderation",
};
