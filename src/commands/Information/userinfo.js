const { MessageEmbed, MessageButton, MessageActionRow } = require("discord.js");
const { dateAndDay } = require("../../utils/plugins/dates");
const { getter } = require("../../utils/emojis");

exports.run = async (client, message, args, { user }) => {
  //------------------VARIÁVEIS BASES----------------------//
  const author =
    client.users.findByName(args[0]) ||
    client.users.cache.get(args[0]) ||
    message.mentions.users.first() ||
    message.author;
  
  const authorData = await client.database.User.findById(author.id);
  const iconURL = author.displayAvatarURL({ dynamic: true });
  const color = process.env.colorEmbed;

  const fetchServer = client.guilds.cache
    .filter((g) => g.members.cache.get(author.id))
    .first();

  const referGuild = !message.guild.members.cache.get(author.id)
    ? fetchServer
    : message.guild;

  const Emojis = new getter(client);
  const member = referGuild.members.cache.get(author.id);
  //-------------------------------------------------------//

  //------------------VARIÁVEIS DA EMBED1------------------//
  const nickname = member.nickname || "Nenhum Nickname";
  const createdAt = `<t:${Math.ceil(author.createdAt.getTime() / 1000)}:f>`;
  const joinedAt = `<t:${Math.ceil(member.joinedAt.getTime() / 1000)}:f>`;
  //-------------------------------------------------------//

  //------------------VARIÁVEIS DA EMBED2------------------//
  const bot = author.bot
    .toString()
    .replace("true", "Sim")
    .replace("false", "Não");

  let presence;
  const userPresence = referGuild.presences.cache.get(author.id);
  const activity = userPresence?.activities[0];

  if (activity !== undefined) {
    switch (activity.type) {
      case "PLAYING":
        presence = "jogando " + activity.name;
        break;
      case "LISTENING":
        presence = "ouvindo " + activity.details;
        break;
      case "STREAMING":
        presence = "transmitindo em " + activity.name;
        break;
      case "WATCHING":
        presence = "assistindo " + activity.name;
        break;
      case "COMPETITING":
        presence = "competindo " + activity.name;
        break;
      case "CUSTOM":
        presence = activity.state;
        break;
    }
  } else presence = "Nenhum atividade";

  const badges =
    author.flags === null
      ? "Nenhuma Insígnia"
      : author.flags
          .toArray()
          .map((e) => Emojis.get(e))
          .join("") || "Nenhuma Insígnia";

  let roles;
  if (message.guild.id !== referGuild.id)
    roles = "Não foi possível acessar os cargos";
  else if (member._roles.length == 0) roles = "Nenhum cargos";
  else
    roles = member._roles.map((r) => `<@&${r}>`).slice(0, 8).join(", ");
  //-------------------------------------------------------//

  //-----------------------EMBEDS--------------------------//
  const pag1 = new MessageEmbed()
    .setAuthor({ name: member.nickname || author.tag, iconURL })
    .setThumbnail(iconURL)
    .addField(`${Emojis.get("reference")} Servidor de Referência: `,referGuild.name)
    .addField(`${Emojis.get("name")} Tag do Usuário: `, author.tag)
    .addField(`${Emojis.get("edited")} Nickname: `, nickname)
    .addField(`${Emojis.get("medal")} Reputações: `, `${authorData?.reps ?? 0}`)
    .addField(":date: Criação da Conta: ", createdAt)
    .addField(":date: Entrada no Server: ", joinedAt)
    .setColor(color)
    .setTimestamp()
    .setFooter({ text: "Pág 1/2" });

  const pag2 = new MessageEmbed()
    .setAuthor({ name: member.nickname || author.tag, iconURL })
    .setThumbnail(iconURL)
    .addField(":id: ID: ", author.id)
    .addField(`${Emojis.get("person_programming")} Um Bot: `, bot)
    .addField(":video_game: Atividade: ", presence)
    .addField(`${Emojis.get("programmer")} Insígnias: `, badges)
    .addField("Cargos: ", roles)
    .setColor(color)
    .setTimestamp()
    .setFooter({ text: "Pág: 2/2" });

  const rowNext = new MessageActionRow().addComponents([
    new MessageButton()
      .setCustomId("next")
      .setEmoji(Emojis.get("next"))
      .setStyle("PRIMARY"),
    new MessageButton()
      .setCustomId("back")
      .setEmoji(Emojis.get("back"))
      .setStyle("PRIMARY")
      .setDisabled(true),
  ]);

  const rowBack = new MessageActionRow().addComponents([
    new MessageButton()
      .setCustomId("next")
      .setEmoji(Emojis.get("next"))
      .setStyle("PRIMARY")
      .setDisabled(true),
    new MessageButton()
      .setCustomId("back")
      .setEmoji(Emojis.get("back"))
      .setStyle("PRIMARY"),
  ]);

  const msg = await message.reply({
    embeds: [pag1],
    components: [rowNext],
  });
  //-------------------------------------------------------//

  //--------------------COLETORES--------------------------//
  const collector = msg.createMessageComponentCollector({
    componentType: "BUTTON",
    time: 45000,
  });

  collector.on("collect", async (i) => {
    if (i.user.id !== message.author.id) {
      return i.reply({
        content: "Só apenas quem executou o comando pode interagir com ele",
        ephemeral: true,
      });
    }

    if (i.customId === "next") {
      await msg
        .edit({
          embeds: [pag2],
          components: [rowBack],
        })
        .catch((o_O) => o_O);
    } else if (i.customId === "back") {
      await msg
        .edit({
          embeds: [pag1],
          components: [rowNext],
        })
        .catch((o_O) => o_O);
    }
  });

  collector.on("end", async () => {
    await msg
      .edit({
        embeds: [pag1.setFooter({ text: "Tempo de Interação Acabado" })],
        components: [],
      })
      .catch((o_O) => o_O);
  });
  //-------------------------------------------------------//
};

exports.help = {
  name: "userinfo",
  description: "Veja as informações de um usuário",
  aliases: ["user", "info-user", "getuser"],
  usage: "userinfo <nome|id|user>",
};
