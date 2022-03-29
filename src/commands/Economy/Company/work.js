const { notifier } = require("../../../utils/plugins/notifier");
const { cooldown } = require("../../../utils/plugins/dates");
const abrev = require("../../../utils/plugins/abbrev");

async function work(client, message, args, { user }) {
  try {
    const { User, Company } = client.database;
    user = await user.populate("company");
    const company = user.company;

    if (!company) {
      return message.reply("Você não pertence a nenhuma empresa!");
    }

    const lastTime = user.cooldowns.company;
    const hours = 21600000;
    const now = Date.now();
    const time = hours - (now - lastTime);

    if (hours - (now - lastTime) > 0 && lastTime !== 0) {
      message.reply(
        `Você já trabalhou hoje, volte em __**${cooldown(new Date(time))}**__`
      );
    } else {
      const newXp = Math.floor(Math.random() * 6) + 1;

      await User.findByIdAndUpdate(user._id, {
        "balance.coins": company.wage + user.balance.coins,
        "cooldowns.company": Date.now(),
      });

      await Company.findByIdAndUpdate(company._id, {
        xp: company.xp + newXp,
      });

      if (company.xp >= company.nextLevel) {
        await Company.findByIdAndUpdate(company._id, {
          xp: 0,
          level: company.level + 1,
          nextLevel: company.nextLevel * company.level,
          wage: company.wage * 2,
        });
      }
      message.reply(`Você ganhou **${abrev(company.wage)}** coins`);
    }
  } catch (err) {
    notifier(client, "Comando Com Error", err);
    message.reply("Aconteceu algum error ao tentar usar o comando!");
  }
}

module.exports = work;
