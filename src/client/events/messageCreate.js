const Guild = require("../../database/Schemas/Guild");
const User = require("../../database/Schemas/User");

module.exports = (client, message) => {
  if (message.author.bot) return;

  Guild.findOne({ _id: message.guild.id }, (err, server) => {
    if (err) return console.log("[MESSAGE-CREATE] - " + err);
    User.findOne({ _id: message.author.id }, async (err, user) => {
      if (err) return console.log("[MESSAGE-CREATE] -" + err);

      if (server) {
        if (user) {
          const prefix = server.prefix;

          if (message.content == `<@${client.user.id}>`)
            return message.reply(
              `Olá ${message.author.username}, o meu nome é ${client.user.username}, o meu prefix nesse servidor é **${prefix}**`
            );
          else if (!message.content.startsWith(prefix)) return;
          else if (message.content == prefix) return;

          try {
            const messageSplit = message.content.split(" ");
            const args = messageSplit.slice(1);
            const commandName = messageSplit[0].slice(prefix.length);

            const commandFile = client.commands.get(
              client.aliases.get(commandName) || commandName
            );
            if (commandFile) commandFile.run(client, message, args, { server, user });
          } catch (err) {
            console.log("[EVENT-MESSAGE] - " + err);
          }
        } else {
          await User.create({ _id: message.author.id }, err => {
            if (err)
              return console.log("[MESSAGE-CREATE] - " + err);
          });
        }
      } else {
        await Guild.create({ _id: message.guild.id }, err => {
          if (err) return console.log("[MESSAGE-CREATE] - " + err);
        });
      }
    });
  });
};
