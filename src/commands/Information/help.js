const { MessageEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");
const Emojis = require("../../utils/emojis");

exports.run = async (client, message, args, { server }) => {
  //---------------------COMMAND VARIABLES-----------------------//
  const iconURL = client.user.displayAvatarURL({ dynamic: true });
  const get = (id) => client.emojis.cache.get(id);

  const embed = new MessageEmbed()
    .setAuthor({ name: "Central De Comandos", iconURL })
    .setColor(process.env.colorEmbed);

  const categorys = {
    Config: "Configurações",
    Information: "Informações",
    Fun: "Diversão",
    Moderation: "Moderação",
    Owner: "Owner",
    Utils: "Utils",
  };

  let Config = [];
  let Information = [];
  let Fun = [];
  let Moderation = [];
  let Owner = [];
  let Utils = [];

  client.commands
    .map((cmd) => cmd)
    .forEach((cmd) => {
      const { category, name } = cmd.help;

      if (category === "Config") Config.push(name);
      if (category === "Information") Information.push(name);
      if (category === "Fun") Fun.push(name);
      if (category === "Moderation") Moderation.push(name);
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
        .addField(`${get(Emojis.name)} Nome Original: `, name)
        .addField(`${get(Emojis.description)} Descrição: `, description)
        .addField(`${get(Emojis.DISCORD_PARTNER_ID)} Aliases: `, aliases.join(", ") || "Não tem aliases")
        .addField(`${get(Emojis.edited)} Modos de Usar: `, server.prefix + usage);

      return message.reply({
        embeds: [embed],
      });
    } else {
      // if you don't find the command
      embed.setDescription(`${get(Emojis.no)} O comando **${args[0]}** não foi encontrado.`);
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
    `)
    .addField(
      `${get(Emojis.settingsId)} Configuração: (${Config.length})`,
      `\`\`\`\n${Config.sort().join(" - ")}\`\`\``
    )
    .addField(
      `${get(Emojis.moderation)} Configuração: (${Moderation.length})`,
      `\`\`\`\n${Moderation.sort().join(" - ")}\`\`\``
    )
    .addField(
      `${get(Emojis.information)} Informação: (${Information.length})`,
      `\`\`\`\n${Information.sort().join(" - ")}\`\`\``
    )
    .addField(
      `${get(Emojis.fun)} Diversão: (${Fun.length})`,
      `\`\`\`\n${Fun.sort().join(" - ")}\`\`\``
    )
    .addField(
      `${get(Emojis.utils)} Utils: (${Utils.length})`,
      `\`\`\`\n${Utils.sort().join(" - ")}\`\`\``
    );

  // in case it's me
  if (message.author.id == process.env.ownerId)
    embed.addField(
      `${get(Emojis.coroa)} Owners: (${Owner.length})`,
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
  usage: `help <command>`,
  category: "Information",
};