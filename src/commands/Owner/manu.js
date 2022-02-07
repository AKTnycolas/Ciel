const { MessageEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");
const { getter } = require("../../utils/emojis");

exports.run = async (client, message, args) => {
  //------------------PLACE OR TAKE OFF-------------------//
  const { Command } = client.database;
  const Emojis = new getter(client);

  if (args[0]) {
    let reason = args.slice(1).join(" ");
    if (!reason) reason = "Não definido";

    const cmd =
      client.commands.get(args[0]) ||
      client.commands.get(client.aliases.get(args[0]));

    if (!cmd) return message.reply("Esse Comando não foi encontrado!");

    const cmdName = cmd.help.name;
    const command = await Command.findById(cmdName);

    if (command) {
      if (command.manu) {
        command.manu = false;
        command.reason = "";
        await command.save();
      } else {
        command.manu = true;
        command.reason = reason;
        command.date = Date.now();
        await command.save();
      }
    } else {
      await Command.create({ _id: cmdName, manu: true, reason });
    }

    const toggle = command.manu
      .toString()
      .replace("true", "colocado na")
      .replace("false", "retirado da");

    return message.reply(
      `O comando **${cmdName}** foi **${toggle}** manutenção`
    );
    setTimeout(() => message.delete(), 5000);
  }
  //-------------------------------------------------------//

  //------------------LIST OF COMMANDS---------------------//
  const allCommands = await Command.find({ manu: true });

  const embed = new MessageEmbed()
    .setAuthor({
      name: "Lista de Comandos",
      iconURL: Emojis.get("update_system").url,
    })
    .setThumbnail(Emojis.get("update_system").url)
    .setColor(process.env.colorEmbed);

  if (allCommands[0]) {
    const description = [];

    for (const cmd of allCommands) {
      const { _id, reason, date } = cmd;

      const subDescription = stripIndents`
        > Nome: **${_id}**
        > Motivo: **${reason}**
        > Desde: <t:${Math.ceil(date.getTime() / 1000)}:f>
        `;

      description.push(subDescription);
    }

    embed.setDescription(description.join("\n\n"));
  } else {
    embed.setDescription("Não há nenhum comando na manutenção");
  }

  message.reply({
    embeds: [embed],
  });
  //-------------------------------------------------------//
};

exports.help = {
  name: "manu",
  description: "Coloque um comando em manutenção",
  aliases: ["manutencao", "maintenance"],
  usage: "manu [comando]",
  category: "Owner",
};
