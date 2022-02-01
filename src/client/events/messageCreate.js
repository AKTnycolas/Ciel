const { notifier } = require("../../utils/plugins/notifier");

module.exports = async (client, message) => {
  //------------------------VERIFICATIONS------------------------//
  if (message.author.bot) return;
  if (message.channel.type === "dm") return;
  //-------------------------------------------------------//

  //-------------------BASE VARIABLES----------------------//
  const { User, Guild, Black, Command } = client.database;
  const author = message.author;
  const guild = message.guild;
  //-------------------------------------------------------//

  //----------------CREATE CASE DOESN'T EXIST--------------//
  let server = await Guild.findById(guild.id);
  let user = await User.findById(author.id);

  try {
    if (!server) {
      const serverD = await Guild.create({ _id: guild.id });
      server = serverD;
    }

    if (!user) {
      const userD = await User.create({ _id: author.id });
      user = userD;
    }
  } catch (err) {
    notifier(client, "Database Error", err);
  }
  //-------------------------------------------------------------//

  //------------------------ANTIEVERYONE SYSTEM------------------------//
  const everyone = guild.members.cache
    .get(author.id)
    .permissions.has("MENTION_EVERYONE");

  if (message.mentions.everyone && !everyone) {
    try {
      const msg = await message.channel.send(
        `${author}, Você não tem permissão para marca everyone!`
      );

      await message.delete();
      setTimeout(() => msg.delete(), 5000);
    } catch (err) {
      notifier(client, "Rejeição Tradada", err);
    }
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
          "Esse comando está em **manutenção** no momento ¯\\_(ツ)_/¯"
        );
    } else {
      await Command.create({ _id: cmdFile.help.name });
    }

    const banned = await Black.findById(author.id);
    if (banned) return message.reply("Você está na minha blacklist!");

    try {
      await cmdFile.run(client, message, args, { server, user });
    } catch (err) {
      return notifier(client, "Comando Com Error", err);
    }
  }
  //-------------------------------------------------------------//
};
