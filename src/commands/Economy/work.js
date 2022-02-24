const { cooldown } = require("../../utils/plugins/dates");
const abrev = require("../../utils/plugins/abbrev");

exports.run = async (client, message, args, { user }) => {
  const { User } = client.database;
  const coins = Math.floor(Math.random() * 500) + 200;

  const lastTime = user.cooldowns.work;
  const oneDay = 21600000;
  const now = Date.now();
  const time = oneDay - (now - lastTime);

  if (oneDay - (now - lastTime) > 0 && lastTime !== 0) {
    message.reply(
      `Você já trabalhou, volte em __**${cooldown(new Date(time))}**__`
    );
  } else {
    await User.findByIdAndUpdate(message.author.id, {
      "balance.coins": coins + user.balance.coins,
      "cooldowns.work": Date.now(),
    });

    message.reply(`Hoje você trabalhou e quanhou **${abrev(coins)}** coins`);
  }
};

exports.help = {
  name: "work",
  description: "Trabalhe!",
  aliases: ["trabalhar"],
  usage: "work",
};
