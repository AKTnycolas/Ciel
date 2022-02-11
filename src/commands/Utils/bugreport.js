const { getter } = require("../../utils/emojis");
const {
  MessageEmbed,
  MessageButton,
  MessageActionRow,
  Util,
} = require("discord.js");

exports.run = async (client, message, args) => {
  //------------------VERIFICATIONS---------------------//
  if (!args[0]) return message.reply("Você não disse o motivo!");

  const reason = args.slice(0).join(" ");

  if (reason.length > 220 || reason.length < 25) {
    return message.reply(
      "O motivo deve ter pelo menos **25** caracteres é no máximo **220**"
    );
  }
  //----------------------------------------------------//

  //---------------------VARIABLES----------------------//
  const iconURL = message.author.displayAvatarURL({ dynamic: true });
  const Emojis = new getter(client);
  const channel = client.channels.cache.get(process.env.bugChannel);
  //----------------------------------------------------//

  //-----------------------EMBED------------------------//
  const embed = new MessageEmbed()
    .setAuthor({
      name: "Bug Encontrado",
      iconURL: Emojis.get("bug").url,
    })
    .setThumbnail(iconURL)
    .addField("Autor: ", message.author.tag)
    .addField("Servidor: ", message.guild.name)
    .addField("Motivo: ", `\`\`\`\n${Util.cleanCodeBlockContent(reason)}\`\`\``)
    .setColor(process.env.colorEmbed)
    .setTimestamp();

  //--------------------------ROWS-----------------------//
  const row = new MessageActionRow().addComponents([
    new MessageButton().setCustomId("yes").setLabel("Sim").setStyle("SUCCESS"),
    new MessageButton().setCustomId("no").setLabel("Não").setStyle("DANGER"),
  ]);

  const msg = await message.reply({
    content: "Você tem certeza que quer enviar esse bug?",
    components: [row],
  });
  //-------------------------------------------------------//

  //--------------------COLETORES--------------------------//
  const collector = msg.createMessageComponentCollector({
    componentType: "BUTTON",
    time: 60000,
  });

  collector.on("collect", async (i) => {
    if (i.user.id !== message.author.id) {
      return i.reply({
        content: "Só apenas quem executou o comando pode interagir com ele",
        ephemeral: true,
      });
    }

    if (i.customId === "yes") {
      await msg.edit({
        content: "O seu report foi enviado com sucesso!",
        components: [],
      });

      await channel.send({
        embeds: [embed],
      });
    } else {
      await msg.edit({
        content: "Ok, não foi enviado",
        components: [],
      });
    }
  });

  collector.on("end", async () => {
    await msg
      .edit({
        content: "Tempo de Interação Acabado",
        components: [],
      })
      .catch((o_O) => o_O);
  });
  //-------------------------------------------------------//
};

exports.help = {
  name: "bugreport",
  description: "Use para reportar um bug",
  aliases: ["bug", "report"],
  usage: "bugreport [motivo]",
  category: "Utils",
};
