const Guild = require("../../database/Schemas/Guild");
const User = require("../../database/Schemas/User");
const Black = require("../../database/Schemas/Black");
const Command = require("../../database/Schemas/Command");
const { notifier } = require("../../utils/plugins/notifier");

module.exports = async (client, message) => {
  //------------------------VERIFICATIONS------------------------//
  if (message.author.bot) return;
  if (message.channel.type === "dm") return;

  const everyone = message.guild.members
    .cache.get(message.author.id)
    .permissions.has("MENTION_EVERYONE");
  //-------------------------------------------------------------//

  //------------------------CREATE CASE DOESN'T EXIST------------------------//
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

  //------------------------ANTIEVERYONE SYSTEM------------------------//
  if (message.mentions.everyone && !everyone) {
    const msg = await message.channel.send(
      `${message.author}, Você não tem permissão para marca everyone!`
    );
    await message.delete().catch(o_0 => o_0);
    setTimeout(() => msg.delete().catch(o_0 => o_0), 5000);
  }
  //-------------------------------------------------------------//

  //------------------------EXECUTE COMMANDS------------------------//
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
  const cmdData = await Command.findById(cmdFile?.help?.name);

  if (cmdFile) {
    if (cmdData) {
      if (cmdData.manu && message.author.id !== process.env.ownerId)
        return message.reply(
          `Desculpe mais o comando **${cmdFile.help.name}** está em manutenção no momento ¯\\_(ツ)\_/¯`
        );
    } else {
      await Command.create({ _id: cmdFile.help.name });
    }
    
    const banned = await Black.findById(message.author.id);
    if (banned) return message.reply("Você está na minha blacklist!");
    
    try {
      await cmdFile.run(client, message, args, { server, user });
    } catch (err) {
      return notifier(client, "Comando Com Error", err);
    }
  }
  //-------------------------------------------------------------//
};
