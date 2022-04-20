const { codeBlock } = require("@discordjs/builders");
const { getter } = require("../../utils/emojis");
const { readdirSync } = require("fs");
const {
  MessageEmbed,
  MessageActionRow,
  MessageSelectMenu,
} = require("discord.js");

exports.run = async (client, message, args) => {
  const Emojis = new getter(client);
  const oneCommand = client.commands.get(
    client.aliases.get(args[0]) || args[0]
  );

  if (oneCommand) {
    const { name, description, aliases, usage } = oneCommand.help;

    const embed = new MessageEmbed().addFields([
      {
        name: `${Emojis.get("name")} Nome Original: `,
        value: name,
      },
      {
        name: `${Emojis.get("description")} Descrição: `,
        value: description,
      },
      {
        name: `${Emojis.get("DISCORD_PARTNER_ID")} Aliases: `,
        value: aliases.join(", ") || "Não tem aliases",
      },
      {
        name: `${Emojis.get("edited")} Modos de Usar: `,
        value: process.env.basePrefix + usage,
      },
    ]);

    return message.reply({ embeds: [embed] });
  }

  const commands = client.commands.map((cmd) => cmd);
  const categoryNames = await readdirSync("./src/commands/");
  const categories = {};
  const embeds = {};

  for (const command of commands) {
    const { category, name } = command.help;
    categories[category] = categories[category] || [];
    categories[category].push(name);
  }

  for (const category in categories) {
    const embed = new MessageEmbed()
      .setAuthor({ name: category, iconURL: Emojis.get(category).url })
      .setDescription(`Todos os comandos da categoria de ${category}`)
      .setColor(process.env.colorEmbed);

    embed.addField(
      "Comandos",
      codeBlock(categories[category].sort().join(" ~ "))
    );
    embeds[category] = embed;
  }

  //~~~~~~~~~~~~~~~~~~~~~~~Main Part~~~~~~~~~~~~~~~~~~~~~//
  const description =
    "Olá, aqui estão todos os meus comandos " +
    `somando um total de **${client.commands.size}**, ` +
    "caso encontre algum bug, use comando " +
    "bugreport, caso você quiser deixar uma sugestão, " +
    "use o comando suggestion";

  const mainEmbed = new MessageEmbed()
    .setAuthor({
      name: `${client.user.username} commands`,
      iconURL: Emojis.get("home").url,
    })
    .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
    .setDescription(description)
    .setColor(process.env.colorEmbed);

  const row = new MessageActionRow().addComponents(
    new MessageSelectMenu()
      .setCustomId("HELP_MENU")
      .setPlaceholder("Selecione uma categoria")
      .addOptions([
        {
          label: "Menu Principal",
          description: "Volte para a o menu principal",
          value: "home",
          emoji: Emojis.get("home"),
        },
        ...categoryNames.map((c) => {
          return {
            label: c,
            description: `Aqui tem ${categories[c].length} comandos`,
            value: c,
            emoji: Emojis.get(c),
          };
        }),
      ])
  );

  const msg = await message.reply({
    embeds: [mainEmbed],
    components: [row],
    fetchReply: true,
  });

  //~~~~~~~~~~~~~~~~~~~~~~~Collector~~~~~~~~~~~~~~~~~~~~~//
  const collector = msg.createMessageComponentCollector({
    componentType: "SELECT_MENU",
    time: 120000,
  });

  collector.on("collect", async (i) => {
    if (i.user.id !== message.author.id) {
      await i.reply({
        content: "Apenas quem executou o comando pode usar ele",
        ephemeral: true,
      });
      return;
    }
    const chosenCategory = i.values[0];
    await msg.edit({
      embeds: [embeds[chosenCategory] || mainEmbed],
      components: [row],
    });
  });

  collector.on("end", async () => {
    await msg
      .edit({
        embeds: [mainEmbed],
        components: [],
      })
      .catch((o_O) => o_O);
  });
};

exports.help = {
  name: "help",
  description: "Veja a minha lista de Comandos",
  aliases: ["commands"],
  usage: "help <command>",
};
