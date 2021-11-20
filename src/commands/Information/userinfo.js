const { MessageEmbed, MessageButton, MessageActionRow } = require("discord.js");
const { dateAndDay } = require("../../utils/plugins/dates");
const Emojis = require("../../utils/emojis");

exports.run = async (client, message, args) => {
  
  //------------------VARIÁVEIS BASES----------------------//
  const author =
    client.users.cache.get(args[0]) ||
    message.mentions.users.first() ||
    message.author;
  const icon = author.displayAvatarURL({ dynamic: true });
  const color = process.env.colorEmbed;
  
  const get = (id) => {
    return client.emojis.cache.filter(x => x.id === id).first();
  };

  const fetchServer = client.guilds.cache
    .filter(g => g.members.cache.filter(x => x.id == author.id))
    .first();

  const guild =
    typeof message.guild.members.cache.get(author.id) !== "object"
      ? fetchServer
      : message.guild;

  const member = guild.members.cache.get(author.id);
  //-------------------------------------------------------//

  //------------------VARIÁVEIS DA EMBED1------------------//
  const nickname = member.nickname || "Nenhum Nickname";
  const createdAt = dateAndDay({ date: author.createdAt, days: true });
  const joinedAt = dateAndDay({ date: member.joinedAt, days: true });
  //-------------------------------------------------------//

  //------------------VARIÁVEIS DA EMBED2------------------//
  const bot = author.bot.toString()
    .replace("true", "SIM")
    .replace("false", "NÃO");
  
  let presence = member.presence ?? "Não Está Jogando Nada";
  presence = typeof presence == "string"
    ? presence
    : typeof presence.activities === "array"
      ? presence.actcivies[0].name
      : "Não Está Jogando Nada";
  
  const badges =
    author.flags
      .toArray()
      .map(e => Emojis[e])
      .join("") || "Nenhuma Insígnia";

  let roles;
  if (message.guild.id !== guild.id)
    roles = "Não foi possível acessar os cargos";
  else if (member._roles.length == 0)
    roles = "Não tem cargos";
  else
    roles = member._roles.map(r => `<@&${r}>`).slice(0, 8).join(", ");
  //-------------------------------------------------------//

  //-----------------------EMBEDS--------------------------//
  const pag1 = new MessageEmbed()
    .setAuthor(member.nickname || author.tag, icon)
    .setThumbnail(icon)
    .addField(`${get(Emojis.reference)} Servidor de Referência: `, guild.name)
    .addField(":capital_abcd: Tag do Usuário: ", author.tag)
    .addField(":abcd: Nickname: ", nickname)
    .addField(`${get(Emojis.door)} Criação da Conta: `, createdAt)
    .addField(`${get(Emojis.door)} Entrada no Server: `, joinedAt)
    .setColor(color)
    .setTimestamp()
    .setFooter("Pág 1/2");

  const pag2 = new MessageEmbed()
    .setAuthor(member.nickname || author.tag, icon)
    .setThumbnail(icon)
    .addField(":id: Id: ", author.id)
    .addField(":robot: Bot?: ", bot)
    .addField(":video_game: Jogando: ", presence)
    .addField(`${get(Emojis.medal)} Insígnias: `, badges)
    .addField("Alguns Cargos: ", roles)
    .setColor(color)
    .setTimestamp()
    .setFooter("Pág: 2/2");
  
  const buttonNext = new MessageButton()
    .setCustomId("next")
    .setEmoji(Emojis.next)
    .setStyle("PRIMARY");
    
    const buttonBack = new MessageButton()
    .setCustomId("back")
    .setEmoji(Emojis.back)
    .setStyle("PRIMARY");
    
    const rowNext = new MessageActionRow().addComponents([
      buttonNext.setDisabled(false),
      buttonBack.setDisabled(true)
    ]);
    
    const rowBack = new MessageActionRow().addComponents([
      buttonNext.setDisabled(true),
      buttonBack.setDisabled(false)
    ])

  const msg = await message.reply({
    embeds: [pag1],
    components: [rowNext]
  });
  //-------------------------------------------------------//

  //--------------------COLETORES--------------------------//
  const filter = (interaction) => {
    return interaction.isButton() && interaction.message.id === msg.id;
  };

  const collector = msg.createMessageComponentCollector({
    filter: filter,
    time: 45000,
  });
  
  collector.on("collect", async (i) => {
    if (i.user.id !== message.author.id) {
      await i.reply({
        content: "Só apenas quem executou o comando pode interagir com ele",
        ephemeral: true
      });
    }
    
    if (i.customId === "next") {
      await msg.edit({
        embeds: [pag2],
        components: [rowBack]
      }).catch(o_O => o_O);
    } else if (i.customId === "back") {
      await msg.edit({
        embeds: [pag1],
        components: [rowNext]
      }).catch(o_O => o_O);
    }
  });
  
  collector.on("end", async () => {
    await msg.edit({
      embeds: [pag1.setFooter("Tempo de Interação Acabado")],
      components: []
    }).catch(o_O => o_O);
  });
  //-------------------------------------------------------//
};

exports.help = {
  name: "userinfo",
  description: "Veja as informações de um usuário",
  aliases: ["user", "info-user", "getuser"],
  usage: "userinfo <id/menção>",
  category: "Information"
};
