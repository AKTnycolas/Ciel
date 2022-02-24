exports.run = async (client, message, args, { server }) => {
  //-------------------BASE VARIABLES----------------------//
  const { Guild } = client.database;
  const prefix = args[0];
  //-------------------------------------------------------//

  //------------------VARIÁVEIS BASES----------------------//
  if (!prefix) {
    return message.reply("Você não disse o prefixo!");
  } else if (prefix.length > 5) {
    return message.reply("O máximo de caracteres permitido é de **5**!");
  } else if (prefix === server.prefix)
    return message.reply("O prefix escolhido é mesmo de agora!");
  //-------------------------------------------------------//
  
  //------------------------RESET--------------------------//
  else if (["reset", "default", "pattern"].includes(args[0])) {
    if (server.prefix == process.env.basePrefix) {
      message.reply("Esse prefixo já é padrão!");
    } else {
      message.reply("O prefix do servidor foi resetado com sucesso");
      await Guild.findByIdAndUpdate(server._id, {
        "prefix": process.env.basePrefix,
      });
    }
  }
  //-------------------------------------------------------//

  //------------------CUSTOMIZED PREFIX--------------------//
  else if (args[0]) {
    if (prefix.length > 5)
      return message.reply("O máximo de caracteres permitido é de **5**!");
    else if (prefix === server.prefix)
      return message.reply("O prefix escolhido é mesmo de agora!");
    else {
      try {
        await Guild.findByIdAndUpdate(server._id, {
          "prefix": prefix,
        });
        message.reply(
          `O prefix do servidor foi alterado, o novo prefix é __**${prefix}**__`
        );
      } catch (err) {
        message.reply("Não foi possivel trocar o prefix!");
        console.log(err);
      }
    }
    return;
  }
  //-------------------------------------------------------//
};

exports.help = {
  name: "prefix",
  description: "Altere o meu prefixo",
  aliases: ["prefixo", "reset-prefix"],
  usage: "prefix <prefixo|reset>",
  permissions: ["MANAGE_GUILD"],
};
