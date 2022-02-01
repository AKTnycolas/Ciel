exports.run = async (client, message, args) => {
  //------------------BASE VARIABLES----------------------//
  const guild = message.guild;
  const author = guild.members.cache.get(message.author.id);

  let member =
    message.mentions.users.first() || guild.members.cache.get(args[0]);
  member = guild.members.cache.get(member?.id);
  const reason = args[0] ? args.slice(1).join(" ") : "Não definido";
  //-------------------------------------------------------//

  //-----------------------CHECKS--------------------------//
  if (!author.permissions.has("KICK_MEMBERS")) {
    return message.reply("Você não tem permissão para kickar membros!");
  } else if (!member || member.id === message.author.id) {
    return message.reply("Usuário não encontrado!");
  } else if (!member.kickable) {
    return message.reply("Eu não tenho permissão para kickar esse membro!");
  }
  //-------------------------------------------------------//

  //-----------------------KICK----------------------------//
  member
    .kick(`Kickado por ${author.user.tag} - ${reason}`)
    .then(() => {
      message.reply(`O usuário ${member.user.tag} foi kicado com sucesso!`);
    })
    .catch((err) => {
      message.reply("Aconteceu algum error ao tentar kickar esse membro!");
      console.error(err);
    });
  //-------------------------------------------------------//
};

exports.help = {
  name: "kick",
  description: "kicka um usuário",
  aliases: ["kickar"],
  usage: "kick [menção|id]",
  category: "Moderation",
};
