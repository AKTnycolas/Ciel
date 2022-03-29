const { notifier } = require("../../../utils/plugins/notifier");

async function kick(client, message, args, { user: authorDoc }) {
  try {
    const { User, Company } = client.database;
    authorDoc = await authorDoc.populate("company");

    const user =
      client.users.cache.get(args[1]) || message.mentions.users.first();
    if (!user) return message.reply("Você não disse qual era o usuário!");

    const userDoc = await User.findById(user.id);
    if (!userDoc)
      return message.reply("Esse usuário não está na minha database!");

    const company = authorDoc.company;

    if (!company) {
      return message.reply("Você não trabalha em nenhuma empresa!");
    } else if (authorDoc._id !== company.owner) {
      return message.reply("Apenas o dono pode kickar os funcionário!");
    } else if (!company.employees.some((employee) => user.id === employee)) {
      return message.reply("Funcionário não encontrado!");
    }

    await User.findByIdAndUpdate(user.id, {
      $unset: { company: "" },
    });

    await Company.findByIdAndUpdate(company._id, {
      $pull: { employees: { $in: [user.id] } },
    });

    message.reply("Funcionário demitido com sucesso!");
  } catch (err) {
    notifier(client, "Comando Com Error", err);
    message.reply("Aconteceu algum error ao tentar usar o comando!");
  }
}

module.exports = kick;
