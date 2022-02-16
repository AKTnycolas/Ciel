const { cooldown } = require("../../utils/plugins/dates");

exports.run = async (client, message, args, { user }) => {
  const { User } = client.database;

  const lastTime = user.cooldowns.rep;
  const coolingTime = 43200000;
  const now = Date.now();
  const time = coolingTime - (now - lastTime);

  if (coolingTime - (now - lastTime) > 0 && lastTime !== 0) {
    message.reply(
      `Você já enviou uma reputação recentemente, volte em **${cooldown(
        new Date(time)
      )}**`
    );
  } else {
    const sender = message.mentions.users.first();

    if (!sender || sender.id === message.author.id)
      return message.reply("Você não mencionou o usuário!");

    const senderData = await User.findById(sender.id);

    if (!senderData)
      return message.reply(
        "Esse usuário ainda não está registrado na minha database!"
      );

    await User.findByIdAndUpdate(sender.id, {
      reps: senderData.reps + 1,
    });

    await User.findByIdAndUpdate(message.author.id, {
      "cooldowns.rep": Date.now(),
    });

    message.reply("Reputação enviada com sucesso!");
  }
};

exports.help = {
  name: "rep",
  description: "Envie uma reputação para um usuário",
  aliases: ["reps", "reputation"],
  usage: "rep [menção]",
  category: "Utils",
};
