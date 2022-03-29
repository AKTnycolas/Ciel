const { notifier } = require("../../../utils/plugins/notifier");

async function name(client, message, args, { user }) {
  try {
    user = await user.populate("company");
    const company = user.company;
    const newName = args.slice(1).join(" ");

    if (!company) {
      return message.reply("Você não pertence a nenhuma empresa!");
    } else if (company.owner !== user._id) {
      return message.reply("Apenas o dono pode trocar o nome!");
    } else if (!newName) {
      return message.reply("Você não disse o nome!");
    } else if (newName === company.name) {
      return message.reply("Esse nome já está setado!");
    } else if (newName.length < 5 || newName.length > 30) {
      return message.reply(
        "O nome tem que ter pelo menos 5 caracteres, e no máximo 30"
      );
    }

    await client.database.Company.findByIdAndUpdate(company._id, {
      name: newName,
    });

    return message.reply("O nome da empresa foi trocado com sucesso!");
  } catch (err) {
    notifier(client, "Comando Com Error", err);
    message.reply("Aconteceu algum error ao tentar usar o comando!");
  }
}

module.exports = name;
