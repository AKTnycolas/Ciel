const { notifier } = require("../../../utils/plugins/notifier");

async function create(client, message, args, { user }) {
  try {
    const { User, Company } = client.database;
    user = await user.populate("company");

    if (user.company) {
      return message.reply("Você já está participando de uma empresa!");
    } else if (user.balance.bank < 2000) {
      return message.reply("Você precisa ter pelo menos 2k no banco!");
    } else {
      const company = await Company.create({ owner: user._id });
      await User.findByIdAndUpdate(user.id, {
        "balance.bank": user.balance.bank - 2000,
        company: company._id,
      });
      return message.reply("A sua empresa foi criada com sucesso!");
    }
  } catch (err) {
    notifier(client, "Comando Com Error", err);
    message.reply("Aconteceu algum error ao tentar usar o comando!");
  }
}

module.exports = create;
