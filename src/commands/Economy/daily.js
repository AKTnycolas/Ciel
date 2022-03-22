const { cooldown } = require("../../utils/plugins/dates");
const abrev = require("../../utils/plugins/abbrev");

exports.run = async (client, message, args, { user }) => {
  const { User } = client.database;
  const coins = Math.floor(Math.random() * 700) + 200;

  const lastTime = user.cooldowns.daily;
  const oneDay = 86400000;
  const now = Date.now();
  const time = oneDay - (now - lastTime);

  if (oneDay - (now - lastTime) > 0 && lastTime !== 0) {
    message.reply(
      `Você já coletou hoje, volte em __**${cooldown(new Date(time))}**__`
    );
  } else {
    await User.findByIdAndUpdate(message.author.id, {
      "balance.coins": coins + user.balance.coins,
      "cooldowns.daily": Date.now(),
    });

    message.reply(`Hoje você qanhou **${abrev(coins)}** coins`);
  }
};

exports.help = {
  name: "daily",
  description: "Pegue a sua recompensa diária",
  aliases: ["diario"],
  usage: "daily",
};
