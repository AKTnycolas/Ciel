exports.run = async (client, message, {}, { server }) => {
  //------------------SIMPLE VERIFICATION------------------//
  const member = message.member;
  if (!member.permissions.has("MANAGER_MESSAGES")) {
    return message.reply("Você na tem permissão de gerenciar mensagens!");
  }
  //-------------------------------------------------------//

  //---------------------ON OR OFF-------------------------//
  if (server.antieveryone) server.antieveryone = false;
  else server.antieveryone = true;
  await server.save();

  const toggle = server.antieveryone
    .toString()
    .replace("true", "ativado")
    .replace("false", "desativado");

  message.reply(`O sistema antieveryone foi **${toggle}** com sucesso`);
  //-------------------------------------------------------//
};

module.exports.help = {
  name: "antieveryone",
  description: "Ligue ou desligue o sistema antieveryone",
  aliases: ["everyone"],
  usage: "antieveryone",
  category: "Config",
};
