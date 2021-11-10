const { MessageEmbed } = require("discord.js");
const { dateAndDay } = require("../../utils/plugins/dates");
const { userinfo } = require("../../utils/plugins/buttons");
const { rowNext, rowBack } = userinfo();
const Emojis = require("../../utils/emojis");

exports.run = async (client, message, args) => {
  //------------------VARIÁVEIS BASES----------------------//
  const author =
    client.users.cache.get(args[0]) ||
    message.mentions.users.first() ||
    message.author;
  const icon = author.displayAvatarURL({ dynamic: true });
  const color = process.env.colorEmbed;

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
  const bot = `${author.bot}`.replace("true", "SIM").replace("false", "NÃO");

  let presence = member.presence;
  if (presence == null) presence = "Não Está Jogando Nada";
  else presence = presence.activities[0].name;

  const badges =
    author.flags
      .toArray()
      .map(e => Emojis[e])
      .join("") || "Nenhuma Insígnia";

  let roles;
  if (message.guild.id !== guild.id)
    roles = "Não foi possível acessar os cargos";
  else roles = member._roles.map(r => `<@&${r}>`).slice(0, 8).join(", ");
  //-------------------------------------------------------//

  //-----------------------EMBEDS--------------------------//
  const pag1 = new MessageEmbed()
    .setAuthor(member.nickname || author.tag, icon)
    .setThumbnail(icon)
    .addField("Servidor de Referência: ", guild.name)
    .addField("Tag do Usuário: ", author.tag)
    .addField("Nickname: ", nickname)
    .addField("Criação da Conta: ", createdAt)
    .addField("Entrada no Server: ", joinedAt)
    .setColor(color)
    .setTimestamp()
    .setFooter("Pág 1/2");

  const pag2 = new MessageEmbed()
    .setAuthor(member.nickname || author.tag, icon)
    .setThumbnail(icon)
    .addField("Id: ", author.id.toString())
    .addField("Bot?: ", bot)
    .addField("Jogando: ", presence)
    .addField("Insígnias: ", badges)
    .addField("Alguns Cargos: ", roles)
    .setColor(color)
    .setTimestamp()
    .setFooter("Pág: 2/2");

  const msg = await message.reply({
    embeds: [pag1],
    components: [rowNext]
  });
  //-------------------------------------------------------//

  //--------------------COLETORES--------------------------//
  const filter = async i => {
    if (i.user.id === message.author.id) return true;
    else {
      await i.reply({
        content: "Só apenas que executou o comando pode interagir com ele",
        ephemeral: true
      });
      return false;
    }
  };

  const collector = message.channel.createMessageComponentCollector({
    filter: filter,
    time: 25000
  });
  
  collector.on("collect", async i => {
    if (i.customId === "nextFromUserinfo") {
      await msg.edit({
        embeds: [pag2],
        components: [rowBack]
      });
    } else if (i.customId === "backFromUserinfo") {
      await msg.edit({
        embeds: [pag1],
        components: [rowNext]
      });
    }
  });

  collector.on("end", async () => {
    await msg.edit({
      embeds: [pag1.setFooter("Tempo de Interação Acabado")],
      components: []
    });
  });
  //-------------------------------------------------------//
};

exports.help = {
  name: "userinfo",
  description: "Veja as informações de um usuário",
  aliases: ["user", "info-user", "getuser"],
  usage: "<prefixo>userinfo <id/menção>",
  category: "Information"
};
