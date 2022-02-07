/*  eslint-disable max-len */
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
  if (!author.permissions.has("MUTE_MEMBERS")) {
    return message.reply(
      "Você precisa da permissão de **MUTE_MEMBERS** para poder usar o comando!"
    );
  } else if (!guild.me.permissions.has("MUTE_MEMBERS")) {
    return message.reply(
      "Eu preciso da permissão de **MUTE_MEMBERS** para poder executar o comando!"
    );
  } else if (!member) {
    return message.reply(
      "Você deve mencionar/inserir o id do usuário a ser desmutado!"
    );
  } else if (!member.manageable) {
    return message.reply(
      "Não foi possível desmutar esse usuário, pois ele tem um cargo maior que o meu"
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
  if (member.roles.cache.get(role.id)) {
    await member.roles.remove(role.id, { reason });
    message.reply(`O usuário ${member.user} foi desmutado com sucesso!`);
  } else {
    message.reply("Esse usuário não está mutado!");
  }
  //-------------------------------------------------------//
};

exports.help = {
  name: "unmute",
  description: "Desmuta um usuário",
  aliases: ["desmutar"],
  usage: "unmute [menção|id]",
  permissions: ["MODERATE_MEMBERS"],
  category: "Moderation",
};
