const Emojis = require("../../utils/emojis");

exports.run = async (client, message, args) => {
  //------------------BASE VARIABLES----------------------//
  const guild = message.guild;
  const get = id => client.emojis.cache.get(id);
  const author = guild.members.cache.get(message.author.id);
  
  const user = client.users.cache.get(args[0]);
  const reason = args[1] ? args.slice(1).join(" ") : "Não definido";
  const ban = guild.bans.cache.get(args[0]);
  //-------------------------------------------------------//
  
  //------------------PERMISSION VERIFICATION----------------------//
  if (!author.permissions.has("BAN_MEMBERS")) {
    return message.reply(
      `Você não tem permissão para desbanir ninguém!`
    );
  } else if (!user || user.id === author.id) {
    return message.reply(
      `Você deve inserir o id do usuário a ser desbanido!`
    );
  } else if (!ban) {
    return message.reply("Esse usuário não está banido!");
  }
  //-------------------------------------------------------//
  
  //------------------BAN---------------------------------//
  guild.members.unban(user.id, reason)
    .then(() => {
      message.reply(
        `${get(Emojis.yes)}│o usuário ${user.tag} foi desbanido com sucesso!`
      );
    })
    .catch(err => {
      message.reply(
        `${get(Emojis.no)}│aconteceu algum error ao tentar desbanir esse usuário!`
      );
      console.error(err);
    });
  //-------------------------------------------------------//
};

module.exports.help = {
  name: "unban",
  description: "Desbane um usuário",
  aliases: ["banir"],
  usage: "unban [id]",
  category: "Moderation",
};
