const { notifier } = require("../../../utils/plugins/notifier");

async function description(client, message, args, { user }) {
  try {
    user = await user.populate("company");
    const company = user.company;
    const newDescription = args.slice(1).join(" ");

    if (!company) {
      return message.reply("Você não pertence a nenhuma empresa!");
    } else if (company.owner !== user._id) {
      return message.reply("Apenas o dono pode trocar a descrição!");
    } else if (!newDescription) {
      return message.reply("Você não disse a descrição!");
    } else if (newDescription === company.description) {
      return message.reply("Essa descrição já está setado!");
    } else if (newDescription.length < 5 || newDescription.length > 120) {
      return message.reply(
        "A descrição tem que ter pelo menos 5 caracteres, e no máximo 120"
      );
    }

    await client.database.Company.findByIdAndUpdate(company._id, {
      description: newDescription,
    });

    return message.reply("A descrição da empresa foi trocado com sucesso!");
  } catch (err) {
    notifier(client, "Comando Com Error", err);
    message.reply("Aconteceu algum error ao tentar usar o comando!");
  }
}

module.exports = description;
