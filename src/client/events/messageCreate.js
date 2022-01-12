const Guild = require("../../database/Schemas/Guild");
const User = require("../../database/Schemas/User");
const { notifier } = require("../../utils/plugins/notifier");

module.exports = async (client, message) => {
  //-------------------------------------------------------------//
  if (message.author.bot) return;
  if (message.channel.type === "dm") return;
  //-------------------------------------------------------------//

  //-------------------------------------------------------------//
  let server = await Guild.findById(message.guild.id);

  if (!server) {
    const serverD = await Guild.create({ _id: message.guild.id }).catch((err) =>
      notifier(client, "Database Error", err)
    );
    server = serverD;
  }
  
  let user = await User.findById(message.author.id);

  if (!user) {
    const userD = await User.create({ _id: message.author.id }).catch((err) =>
      notifier(client, "Database Error", err)
    );
    user = userD;
  }
  //-------------------------------------------------------------//

  //-------------------------------------------------------------//
  const prefix = await server.prefix;

  if (message.content === `<@${client.user.id}>`)
    return message.reply(
      `Olá ${message.author}, o meu prefix nesse servidor é __**${prefix}**__`
    );
  else if (!message.content.startsWith(prefix)) return;
  else if (message.content === prefix) return;

  const messageSplit = message.content.split(" ");
  const args = messageSplit.slice(1);
  const cmdName = messageSplit[0].slice(prefix.length);

  const cmdFile = client.commands.get(client.aliases.get(cmdName) || cmdName);

  if (cmdFile) {
    try {
      await cmdFile.run(client, message, args, { server, user });
    } catch (err) {
      return notifier(client, "Comando Com Error", err);
    }
  }
  //-------------------------------------------------------------//
};
