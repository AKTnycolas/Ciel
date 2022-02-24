const { cooldown } = require("../../utils/plugins/dates");
const abrev = require("../../utils/plugins/abbrev");

exports.run = async (client, message, args, { user }) => {
  const { User } = client.database;

  const lastTime = user.cooldowns.theft;
  const oneDay = 21600000;
  const now = Date.now();
  const time = oneDay - (now - lastTime);

  if (oneDay - (now - lastTime) > 0 && lastTime !== 0) {
    message.reply(
      `Você já roubou recentemente, volte em **${cooldown(new Date(time))}**`
    );
  } else {
    const underdog =
      client.users.cache.get(args[0]) || message.mentions.users.first();

    if (!underdog)
      return message.reply("Você não mencionou/inseriu o id do usuário!");

    const underdogData = await User.findById(underdog.id);

    if (!underdogData) {
      return message.reply("Esee usuário ainda não está na minha database!");
    } else if (underdogData.balance.coins < 50) {
      return message.reply("Você não pode roubar menos de **50** coins!");
    }

    const coins = Math.floor(Math.random() * underdogData.balance.coins);

    await User.findByIdAndUpdate(underdog.id, {
      "balance.coins": underdogData.balance.coins - coins,
    });

    await User.findByIdAndUpdate(message.author.id, {
      "balance.coins": user.balance.coins + coins,
      "cooldowns.theft": Date.now(),
    });

    message.reply(`Parabéns você conseguiu roubar **${abrev(coins)}** coins`);
  }
};

exports.help = {
  name: "daily",
  description: "Pegue a sua recompensa diária",
  aliases: ["diario"],
  usage: "daily",
};
