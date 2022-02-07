/* eslint-disable max-len */
exports.run = async (client, message, args) => {
  //------------------SET THE VARIABLES----------------------//
  const guild = message.guild;
  const author = guild.members.cache.get(message.author.id);

  let member =
    client.users.cache.get(args[0]) || message.mentions.users.first();
  member = guild.members.cache.get(member?.id);
  const reason = args[1] ? args.slice(1).join(" ") : "Não Informado";
  //-------------------------------------------------------//

  //------------------CHECK PERMISSIONS----------------------//
  if (!guild.me.permissions.has("MUTE_MEMBERS")) {
    return message.reply(
      "Eu preciso da permissão de **MUTE_MEMBERS** para poder usar o comando!"
    );
  } else if (!member) {
    return message.reply(
      "Você deve mencionar/inserir o id do usuário a ser mutado!"
    );
  } else if (!member.manageable) {
    return message.reply(
      "Não foi possível mutar esse usuário, pois ele tem um cargo maior que o meu"
    );
  }
  //-------------------------------------------------------//

  //------------------POSITIONS----------------------//
  let role = guild.roles.cache.find((x) => x.name === "Mutado");

  if (!role) {
    role = await guild.roles.create({ name: "Mutado", color: "GREY" });

    message.guild.channels.cache.forEach((c) => {
      c.permissionOverwrites.create(role.id, {
        SEND_MESSAGES: false,
        ADD_REACTIONS: false,
        SPEAK: false,
        STREAM: false,
      });
    });
  }
  //-------------------------------------------------------//

  //------------------VARIÁVEIS BASES----------------------//
  if (!member.roles.cache.get(role.id)) {
    await member.roles.add(
      role.id,
      `Mutado por ${message.author.tag} - ${reason}`
    );
    message.reply(`O usuário ${member.user} foi mutado com sucesso!`);
  } else {
    message.reply("Esse usuário já está mutado");
  }
  //-------------------------------------------------------//
};

exports.help = {
  name: "mute",
  description: "muta um usuário",
  aliases: ["silenciar"],
  usage: "mute [menção|id]",
  permissions: ["MODERATE_MEMBERS"],
  category: "Moderation",
};
