const { MessageEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");
const Command = require("../../database/Schemas/Command");
const Emojis = require("../../utils/emojis");

exports.run = async (client, message, args) => {
  if (message.author.id !== process.env.ownerId) return;

  if (!args[0]) {
    const get = (id) => client.emojis.cache.get(id);
    const allCommands = await Command.find({ manu: true });

    const embed = new MessageEmbed()
      .setAuthor({ name: "Lista de Comandos", iconURL: get(Emojis.update_system).url, })
      .setThumbnail(get(Emojis.update_system).url)
      .setColor(process.env.colorEmbed);

    if (allCommands[0]) {
      const description = [];

      for (let cmd of allCommands) {
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
  } else {
    let reason = args.slice(1).join(" ");
    if (!reason) reason = "Não definido";

    const inputCommandName = args[0];
    let status = "colocado na";

    const cmd =
      client.commands.get(inputCommandName) ||
      client.commands.get(client.aliases.get(inputCommandName));

    if (!cmd)
      return message.reply(`O Comando **${inputCommandName}** não foi encontrado!`);

    const cmdName = cmd.help.name;
    const command = await Command.findById(cmdName);

    if (command) {
      if (command.manu) {
        await Command.findByIdAndUpdate(cmdName, {
          $set: { manu: false, reason: "" },
        });
        status = "retirado da";
      } else {
        await Command.findByIdAndUpdate(cmdName, {
          $set: { manu: true, reason, date: Date.now() },
        });
      }
    } else {
      await Command.create({ _id: cmdName, manu: true, reason });
    }

    const embed = new MessageEmbed()
      .setDescription(`O comando **${cmdName}** foi ${status} manutenção`)
      .setColor(process.env.colorEmbed);

    await message.reply({
      embeds: [embed],
    });
  }

  setTimeout(() => message.delete(), 5000);
};

exports.help = {
  name: "manu",
  description: "Coloque um comando em manutenção",
  aliases: ["manutencao", "maintenance"],
  usage: "manu [comando]",
  category: "Owner",
};
