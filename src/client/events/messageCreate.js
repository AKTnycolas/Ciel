module.exports = (client, message) => {
  if (message.author.bot) return;

  const prefix = "l.";

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
    if (commandFile)
      commandFile.run(client, message, args);
  } catch (err) {
    console.log("(EVENT-MESSAGE): " + err);
  }
};