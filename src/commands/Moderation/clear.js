/* eslint-disable max-len */
exports.run = async (client, message, args) => {
  //------------------VARIÁVEIS BASES----------------------//
  const guild = message.guild;
  const amount = parseInt(args[0]) + 1;
  //-------------------------------------------------------//

  //------------------VERIFICATIONS----------------------//
  if (!guild.me.permissions.has("MANAGE_MESSAGES")) {
    return message.reply(
      "Eu preciso da permissão de **MANAGE_MESSAGES** para poder executar o comando!"
    );
  } else if (!amount) {
    return message.reply("Você não disse a quantidade!");
  } else if (amount < 1 || amount > 99) {
    return message.reply(
      "A quantidade mínima é de 1 e a máxima de 98 mensagens!"
    );
  }
  //-------------------------------------------------------//

  //------------------DELETING MESSAGES----------------------//
  const messages = await message.channel.messages.fetch({ limit: amount });
  await message.channel.bulkDelete(messages, true);

  const msg = await message.channel.send(
    `Foram apagadas **${amount}** mensagens com sucesso`
  );

  setTimeout(() => msg.delete().catch((o_0) => o_0), 5000);
  //-------------------------------------------------------//
};

module.exports.help = {
  name: "clear",
  description: "Limpa as mensagens no chat",
  aliases: ["limpar", "apagar"],
  usage: "clear [quantidade]",
  permissions: ["MANAGE_MESSAGES"],
};
