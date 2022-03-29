const { notifier } = require("../../../utils/plugins/notifier");

async function delet(client, message, args, { user }) {
  try {
    const { User, Company } = client.database;
    user = await user.populate("company");

    if (!user.company) {
      return message.reply("Você não está participando de nenhuma empresa!");
    } else if (user.company.owner !== user._id) {
      return message.reply("Apenas o dono pode apagar a empresa!");
    } else {
      await User.findByIdAndUpdate(user.id, {
        $unset: { company: "" },
      });
      await Company.findByIdAndRemove(user.company._id);
      return message.reply("A sua empresa foi deletada com sucesso!");
    }
  } catch (err) {
    notifier(client, "Comando Com Error", err);
    message.reply("Aconteceu algum error ao tentar usar o comando!");
  }
}

module.exports = delet;
