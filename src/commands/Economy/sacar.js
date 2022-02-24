const abrev = require("../../utils/plugins/abbrev");

exports.run = async (client, message, args, { user }) => {
  //------------------BASE VARIABLES----------------------//
  const { User } = client.database;
  const { coins, bank } = user.balance;
  //-------------------------------------------------------//

  //------------------SIMPLE CHECK----------------------//
  if (bank === 0) {
    return message.reply("Você não tem dinheiro o suficiente para sacar!");
  } else if (bank < 50) {
    return message.reply("Você não pode sacar menos de **50** coins");
  }
  //-------------------------------------------------------//

  //------------------------ALL----------------------------//
  if (["all", "todo"].includes(args[0])) {
    await User.findByIdAndUpdate(message.author.id, {
      "balance.coins": coins + bank,
      "balance.bank": 0,
    });

    return message.reply("Todo o seu dinheiro foi sacado com sucesso!");
  }
  //-------------------------------------------------------//

  //------------------DEPOSIT AN AMOUNT--------------------//
  const amount = parseInt(args[0]);

  if (!amount) {
    return message.reply("Você não disse a quantidade!");
  } else if (amount > bank) {
    return message.reply("Você não tem todo esse dinheiro!");
  } else if (amount < 50) {
    return message.reply("Você não pode sacar menos de **50** coins!");
  }

  await User.findByIdAndUpdate(message.author.id, {
    "balance.coins": coins + amount,
    "balance.bank": bank - amount,
  });

  return message.reply(`Foi sacado **${abrev(amount)}** coins com sucesso`);
};
//-------------------------------------------------------//

exports.help = {
  name: "sacar",
  description: "Saque dinheiro no banco",
  aliases: ["withdraw"],
  usage: "sacar [quantitade]",
};
