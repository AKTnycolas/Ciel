const abrev = require("../../utils/plugins/abbrev");

exports.run = async (client, message, args, { user }) => {
  //------------------BASE VARIABLES----------------------//
  const { User } = client.database;
  const { coins, bank } = user.balance;
  //-------------------------------------------------------//

  //------------------SIMPLE CHECK----------------------//
  if (coins === 0) {
    return message.reply("Você não tem dinheiro o suficiente para depositar!");
  } else if (coins < 50) {
    return message.reply("Você não pode depositar menos de **50** coins");
  }
  //-------------------------------------------------------//

  //------------------------ALL----------------------------//
  if (["all", "todo"].includes(args[0])) {
    await User.findByIdAndUpdate(message.author.id, {
      "balance.coins": 0,
      "balance.bank": coins + bank,
    });

    return message.reply("Todo o seu dinheiro foi depositado com sucesso!");
  }
  //-------------------------------------------------------//

  //------------------DEPOSIT AN AMOUNT--------------------//
  const amount = parseInt(args[0]);
  
  if (!amount) {
    return message.reply("Você não disse a quantidade!");
  } else if (amount > coins) {
    return message.reply("Você não tem todo esse dinheiro!");
  } else if (amount < 50) {
    return message.reply("Você não pode depositar menos de **50** coins!");
  }

  await User.findByIdAndUpdate(message.author.id, {
    "balance.coins": coins - amount,
    "balance.bank": bank + amount,
  });

  return message.reply(`Foi depositado **${abrev(amount)}** coins com sucesso`);
};
//-------------------------------------------------------//

exports.help = {
  name: "depositar",
  description: "Deposite dinheiro no banco",
  aliases: ["dep", "deposit"],
  usage: "depisitar [quantitade]",
};
