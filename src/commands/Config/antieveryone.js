exports.run = async (client, message, {}, { server }) => {
  //---------------------ON OR OFF-------------------------//
  await Guild.findByIdAndUpdate(server._id, {
    "antieveryone": !server.atieveryone,
  });

  const toggle = `${!server.antieveryone}`
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
  permissions: ["MANAGE_GUILD"],
  category: "Config",
};
