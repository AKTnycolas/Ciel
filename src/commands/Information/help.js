const { MessageEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");
const { getter } = require("../../utils/emojis");

exports.run = async (client, message, args) => {
  //---------------------COMMAND VARIABLES-----------------------//
  const iconURL = client.user.displayAvatarURL({ dynamic: true });
  const Emojis = new getter(client);

  const embed = new MessageEmbed()
    .setAuthor({ name: "Central De Comandos", iconURL })
    .setColor(process.env.colorEmbed);

  const Config = [];
  const Economy = [];
  const Information = [];
  const Fun = [];
  const Moderation = [];
  const Music = [];
  const Owner = [];
  const Utils = [];

  client.commands
    .map((cmd) => cmd)
    .forEach((cmd) => {
      const { category, name } = cmd.help;

      if (category === "Config") Config.push(name);
      if (category === "Economy") Economy.push(name);
      if (category === "Information") Information.push(name);
      if (category === "Fun") Fun.push(name);
      if (category === "Moderation") Moderation.push(name);
      if (category === "Music") Music.push(name);
      if (category === "Owner") Owner.push(name);
      if (category === "Utils") Utils.push(name);
    });
  //-------------------------------------------------------------//

  //--------------------------COMMAND----------------------------//
  if (args[0]) {
    const cmd = client.commands.get(client.aliases.get(args[0]) || args[0]);

    if (cmd) {
      // if the command is restricted
      if (
        cmd.help.category === "Owner" &&
        message.author.id !== process.env.ownerId
      ) {
        embed.setDescription(`O comando **${args[0]}** não foi encontrado.`);
        return message.reply({
          embeds: [embed],
        });
      }

      // command alone
      const { name, description, aliases, usage } = cmd.help;

      embed
        .addField(`${Emojis.get("name")} Nome Original: `, name)
        .addField(`${Emojis.get("description")} Descrição: `, description)
        .addField(
          `${Emojis.get("DISCORD_PARTNER_ID")} Aliases: `,
          aliases.join(", ") || "Não tem aliases"
        )
        .addField(
          `${Emojis.get("edited")} Modos de Usar: `,
          process.env.basePrefix + usage
        );

      return message.reply({
        embeds: [embed],
      });
    } else {
      // if you don't find the command
      embed.setDescription(
        `${Emojis.get("no")} O comando **${args[0]}** não foi encontrado.`
      );
      return message.reply({
        embeds: [embed],
      });
    }
  }

  // just help
  embed
    .setDescription(stripIndents`
    Olá, aqui estão todos os meu comandos
    somando um total de **${client.commands.size}**, caso encontre
    algum bug, use o comando **bugreport**, caso
    queria deixar uma sugestão use o comando **suggestion**
        ㅤ
    `
    )
    .addField(
      `${Emojis.get("settingsId")} Configuração: (${Config.length})`,
      `\`\`\`\n${Config.sort().join(" - ")}\`\`\``
    )
    .addField(
      `${Emojis.get("moderation")} Moderação: (${Moderation.length})`,
      `\`\`\`\n${Moderation.sort().join(" - ")}\`\`\``
    )
    .addField(
      `${Emojis.get("Economy")} Economia: (${Economy.length})`,
      `\`\`\`\n${Economy.sort().join(" - ")}\`\`\``)
    .addField(
      `${Emojis.get("information")} Informação: (${Information.length})`,
      `\`\`\`\n${Information.sort().join(" - ")}\`\`\``
    )
    .addField(
      `${Emojis.get("fun")} Diversão: (${Fun.length})`,
      `\`\`\`\n${Fun.sort().join(" - ")}\`\`\``
    )
    .addField(
      `:notes: Músicas: (${Music.length})`,
      `\`\`\`\n${Music.sort().join(" - ")}\`\`\``
    )
    .addField(
      `${Emojis.get("utils")} Utils: (${Utils.length})`,
      `\`\`\`\n${Utils.sort().join(" - ")}\`\`\``
    );

  // in case it's me
  if (message.author.id == process.env.ownerId)
    embed.addField(
      `${Emojis.get("coroa")} Owners: (${Owner.length})`,
      `\`\`\`\n${Owner.sort().join(" - ")}\`\`\``
    );

  return message.reply({
    embeds: [embed],
  });
};
//-------------------------------------------------------------//

exports.help = {
  name: "help",
  description: "Veja a minha lista de Comandos",
  aliases: ["commands"],
  usage: "help <command>",
};
