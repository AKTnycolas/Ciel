const { notifier } = require("../../utils/plugins/notifier");
const { getter } = require("../../utils/emojis");

module.exports = async (client, message) => {
  //------------------------VERIFICATIONS------------------------//
  if (message.author.bot) return;
  if (message.channel.type === "dm") return;
  //-------------------------------------------------------//

  //-------------------BASE VARIABLES----------------------//
  const { User, Guild, Black, Command } = client.database;
  const author = message.author;
  const guild = message.guild;
  const member = message.member;
  const Emojis = new getter(client);
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
  //--------------------------------------------------------//

  //-------------------ANTIEVERYONE SYSTEM------------------//
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
  //-----------------------------------------------------//

  //----------------------XP SYSTEM----------------------//
  const { xp, level, nextLevel } = user.exp;
  const newXp = Math.floor(Math.random() * 6) + 1;

  // setting xp
  await User.findByIdAndUpdate(author.id, {
    "exp.xp": xp + newXp,
  });

  if (xp >= nextLevel) {
    await User.findByIdAndUpdate(author.id, {
      "exp.xp": 0,
      "exp.level": level + 1,
      "exp.nextLevel": nextLevel * level,
    });

    if (server.levelMessage.toggle) {
      const channel =
        client.channels.cache.get(server.levelMessage.channel) ||
        message.channel;

      let msg =
        server.levelMessage.message === "nenhuma"
          ? `${Emojis.get("levelUp")} | {member} vc chegou ao lvl **${level}** agora vc precisa de ${nextLevel}xp para chegar ao próximo lvl`
          : server.levelMessage.message;

      msg = msg
        .replace(/{member}/g, `<@${member.id}>`)
        .replace(/{level}/g, user.exp.xp)
        .replace(/{nextLevel}/g, user.exp.nextLevel);

      await channel.send(msg).catch((o_O) => o_O);
    }
  }
  //-------------------------------------------------------//

  //------------------------EXECUTE COMMANDS--------------//
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
    //------------------MAINTENANCE SYSTEM-------------------//
    if (cmdData) {
      if (cmdData.manu && author.id !== process.env.ownerId)
        return message.reply(
          "Esse comando está em **manutenção** no momento ¯\\_(ツ)_/¯"
        );
    } else {
      await Command.create({ _id: cmdFile.help.name });
    }
    //-------------------------------------------------------//

    //------------------BLACKLIST SYSTEM---------------------//
    const banned = await Black.findById(author.id);
    if (banned) return message.reply("Você está na minha blacklist!");
    //-------------------------------------------------------//

    //------------------COOLDOWN SYSTEM----------------------//
    if (client.cooldowns.includes(author.id)) {
      if (author.id === process.env.ownerId) {
      } else
        return message.reply(
          "Por favor espere **3** segundos para poder usar outro comando novamente."
        );
    } else {
      client.cooldowns.push(author.id);
      setTimeout(
        () => client.cooldowns.splice(client.cooldowns.indexOf(author.id), 1),
        3000
      );
    }
    //-------------------------------------------------------//

    //---------------------SOME CHECKS-----------------------//
    if (cmdFile.help.permissions) {
      for (const permission of cmdFile.help.permissions) {
        if (!member.permissions.has(permission)) {
          return message.reply(
            `Você precisa da permissão **${permission}** para executar esee comando!`
          );
        }
      }
    }

    if (
      cmdFile.help.category === "Owner" &&
      author.id !== process.env.ownerId
    ) {
      return;
    }
    //-------------------------------------------------------//

    try {
      await cmdFile.run(client, message, args, { server, user });
    } catch (err) {
      return notifier(client, "Comando Com Error", err);
    }
  }
  //-------------------------------------------------------------//
};
