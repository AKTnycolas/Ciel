const { MessageEmbed, MessageButton, MessageActionRow } = require("discord.js");
const { stripIndents } = require("common-tags");
const { dateAndDay } = require("../../utils/plugins/dates");
const acro = require("../../utils/acronyms");
const Emojis = require("../../utils/emojis");

exports.run = async (client, message, args, { server }) => {
  
  //--------------------VARIÁVEIS BASES--------------------------// 
  const guild = message.guild;
  const member = message.member;
  
  const iconURL = guild.iconURL({ dynamic: true });
  const color = process.env.colorEmbed;
  
  const get = id => client.emojis.cache.get(id);
  //-------------------------------------------------------------// 
  
  //-------------------EMBED1 VARIABLES--------------------------// 
  const ownerTag = client.users.cache.get(guild.ownerId).tag;
  const mainLanguage = acro.get(guild.preferredLocale) ?? "Língua não encontrada";
  
  const yourEntry = `<t:${Math.ceil(member.joinedAt.getTime()/1000)}:f>`;
  const createdAt = `<t:${Math.ceil(guild.createdAt.getTime()/1000)}:f>`;
  //-------------------------------------------------------------// 
  
  
  //--------------------EMBED2 VARIABLES-------------------------// 
  const totalBoost = guild.premiumSubscriptionCount === 0
    ? "Nenhum Boost"
    : `**${guild.premiumSubscriptionCount}** Boosts ( ${guild.premiumTier} )`;

  let vLevel = guild.verificationLevel;
  switch (vLevel) {
    case (vLevel === "NOME"): vLevel == "Nenhum"; break;
    case (vLevel === "LOW"): vLevel == "Baixo"; break;
    case (vLevel === "MEDIUM"): vLevel == "Médio"; break;
    case (vLevel === "HIGH"): vLevel == "Alto"; break;
    default: vLevel = "Muito Alto"; break;
  };

  const channels = guild.channels.cache;
  const channelServer = [
    channels.size,
    channels.filter(x => x.type == "GUILD_CATEGORY").size,
    channels.filter(x => x.type == "GUILD_TEXT").size,
    channels.filter(x => x.type == "GUILD_VOICE").size
  ];

  const status = guild.presences.cache;
  const statuServer = [
    status.filter(x => x.status == "online").size,
    status.filter(x => x.status == "idle").size,
    status.filter(x => x.status == "dnd").size,
    status.filter(x => x.status == "offline").size
  ];

  const members = guild.members.cache;
  const memberServer = [
    members.size,
    members.filter(x => x.user.bot).size,
    members.size - members.filter(x => x.user.bot).size
  ];

  const emojis = guild.emojis.cache;
  const emojiServer = [
    emojis.size,
    emojis.filter(x => x.animated).size,
    emojis.filter(x => x.animated == false).size
  ];
  //-------------------------------------------------------------// 
  
  
  //-------------------------EMBEDS------------------------------// 
  const pag1 = new MessageEmbed()
    .setAuthor({ name: guild.name, iconURL })
    .setThumbnail(iconURL)
    .addField(`${get(Emojis.name)} Nome: `, guild.name)
    .addField(`${get(Emojis.coroa)} Dono(a): `, ownerTag)
    .addField(`:speech_balloon: Idioma: `, mainLanguage)
    .addField(`:date: Criado Em: `, createdAt)
    .addField(`:date: Sua Entrada: `, yourEntry)
    .setColor(color)
    .setTimestamp()
    .setFooter({ text: "Pág: 1/2" });
  
  
  const pag2 = new MessageEmbed()
    .setAuthor({ name: guild.name, iconURL })
    .setThumbnail(iconURL)
    .addField(`${get(Emojis.name)} Id: `, guild.id)
    .addField(`${get(Emojis.boost)} Boosts: `, totalBoost)
    .addField(`${get(Emojis.shield)} Nível de Verificação: `, vLevel)
    .addField(`${get(Emojis.channel)} Canais: `, stripIndents`\`\`\`
    Total: ${channelServer[0]}
    Cartegorias: ${channelServer[1]}
    Texto: ${channelServer[2]}
    Voz: ${channelServer[3]}
    \`\`\`
    `
    )
    .addField(`${get(Emojis.online)} Presenças: `, stripIndents`\`\`\`
    Onlines: ${statuServer[0]}
    Ausentes: ${statuServer[1]}
    Não Pertube: ${statuServer[2]}
    Offline: ${statuServer[3]}
    \`\`\`
    `
    )
    .addField(`${get(Emojis.users)} Membros: `, stripIndents`\`\`\`
    Total: ${memberServer[0]}
    Humanos: ${memberServer[2]}
    Bots: ${memberServer[1]}
    \`\`\`
    `
    )
    .addField(`${get(Emojis.full_heart)} Emojis: `, stripIndents`\`\`\`
    Total: ${emojiServer[0]}
    Animados: ${emojiServer[1]}
    Inanimados: ${emojiServer[2]}
    \`\`\`
    `
    )
    .setColor(color)
    .setTimestamp()
    .setFooter({ text: "Pág: 2/2" });
  //-------------------------------------------------------------//
  
  const rowNext = new MessageActionRow().addComponents([
    new MessageButton()
      .setCustomId("next")
      .setEmoji(Emojis.next)
      .setStyle("PRIMARY"),
    new MessageButton()
      .setCustomId("back")
      .setEmoji(Emojis.back)
      .setStyle("PRIMARY")
      .setDisabled(true),
  ]);

  const rowBack = new MessageActionRow().addComponents([
    new MessageButton()
      .setCustomId("next")
      .setEmoji(Emojis.next)
      .setStyle("PRIMARY")
      .setDisabled(true),
    new MessageButton()
      .setCustomId("back")
      .setEmoji(Emojis.back)
      .setStyle("PRIMARY"),
  ])
  
  const msg = await message.reply({
    embeds: [pag1],
    components: [rowNext]
  });
  //-------------------------------------------------------------//
  
  
  //------------------------COLLECTOR----------------------------//
  const collector = msg.createMessageComponentCollector({
    componentType: "BUTTON",
    time: 45000,
  });
  
  collector.on("collect", async (i) => {
    if (i.user.id !== message.author.id)
      return i.reply({
        content: "Só apenas quem executou o comando pode interagir com ele",
        ephemeral: true
      });
    
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
      embeds: [pag1.setFooter({ text: "Tempo de interação acabado." })],
      components: []
    }).catch(o_O => o_O);
  });
  //-------------------------------------------------------------//
};


module.exports.help = {
  name: "serverinfo",
  description: "Veja as informações desse servidor",
  aliases: ["server", "info-server"],
  usage: "serverinfo",
  category: "Information"
};