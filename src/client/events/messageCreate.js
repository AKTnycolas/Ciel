const Guild = require("../../database/Schemas/Guild");
const User = require("../../database/Schemas/User");
const { notifier } = require("../../utils/plugins/notifier");

module.exports = (client, message) => {
  if (message.author.bot) return;
  if (message.channel.type === "dm") return;

  Guild.findOne({ _id: message.guild.id }, (err, server) => {
    if (err) return notifier(client, "Database Error", err);
    User.findOne({ _id: message.author.id }, async (err, user) => {
      if (err) return notifier(client, "Database Error", err);

      if (server) {
        if (user) {
          
          
          //-------------------------------------------------------------//
          const prefix = server.prefix;

          if (message.content === `<@${client.user.id}>`)
            return message.reply(`Olá ${message.author}, o meu prefix nesse servidor é __**${prefix}**__`);
          else if (!message.content.startsWith(prefix)) return;
          else if (message.content === prefix) return;

          const messageSplit = message.content.split(" ");
          const args = messageSplit.slice(1);
          const cmdName = messageSplit[0].slice(prefix.length);

          const cmdFile = client.commands.get(client.aliases.get(cmdName) || cmdName);

          if (cmdFile) {
            try {
              cmdFile.run(client, message, args, { server, user });
            } catch (err) {
              return notifier(client, "Comando Com Error", err);
            }
          }
          //-------------------------------------------------------------//
          
          
        } else {
          await User.create({ _id: message.author.id }, err => {
            if (err) notifier(client, "Database Error", err);
          });
        }
      } else {
        await Guild.create({ _id: message.guild.id }, err => {
          if (err) notifier(client, "Database Error", err);
        });
      }
    });
  });
};
