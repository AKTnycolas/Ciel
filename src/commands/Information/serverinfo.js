const { MessageEmbed, MessageButton, MessageActionRow } = require("discord.js");
const { stripIndents } = require("common-tags");
const { dateAndDay } = require("../../utils/plugins/dates");
const acro = require("../../utils/acronyms");
const Emojis = require("../../utils/emojis");

exports.run = async (client, message, args, { server }) => {
  
  //--------------------VARIÁVEIS BASES--------------------------// 
  const guild = message.guild;
  const icon = guild.iconURL({ dynamic: true });
  const color = process.env.colorEmbed;
  
  const get = (id) => {
    return client.emojis.cache.filter(x => x.id == id).first();
  };
  //-------------------------------------------------------------// 
  
  //-------------------EMBED1 VARIABLES--------------------------// 
  const owner = client.users.cache.get(guild.ownerId).tag;
  const mainLanguage = acro.get(guild.preferredLocale);
  const myEntry = dateAndDay({
    date: guild.members.cache.get(client.user.id).joinedAt,
    days: true
  });
  const yourEntry = dateAndDay({
    date: guild.members.cache.get(message.author.id).joinedAt,
    days: true
  });
  //-------------------------------------------------------------// 
  
  
  //--------------------EMBED2 VARIABLES-------------------------// 
  const totalBoost = guild.premiumSubscriptionCount === 0
    ? "Nenhum Boost"
    : `**${guild.premiumSubscriptionCount}** Boosts ( ${guild.premiumTier} )`;

  const createdAt = dateAndDay({
    date: guild.createdAt,
    days: true
  });

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

  const members = guild.members.cache; // support variable
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
  
  const someEmojis = emojis.size >= 1
    ? `${emojis.map(x => x).slice(0, 26).join("**|**")}`
    : "Nenhum Emoji Encontrado";
  //-------------------------------------------------------------// 
  
  
  
  //-------------------------EMBEDS------------------------------// 
  const pag1 = new MessageEmbed()
    .setAuthor(guild.name, icon)
    .setThumbnail(icon)
    .addField(`${get(Emojis.name)} Nome: `, `${guild.name}`)
    .addField(`${get(Emojis.coroa)} Dono(a): `, `${owner}`)
    .addField(`${get(Emojis.world)} Idioma: `, `${mainLanguage}`)
    .addField(`${get(Emojis.door)} Minha Entrada: `, myEntry)
    .addField(`${get(Emojis.door)} Sua Entrada: `, yourEntry)
    .setColor(color)
    .setTimestamp()
    .setFooter("Pág: 1/2");
  
  
  const pag2 = new MessageEmbed()
    .setAuthor(guild.name, icon)
    .setThumbnail(icon)
    .addField(":1234: Id: ", `${guild.id}`)
    .addField(`${get("904835204307361822")} Boosts: `, `${totalBoost}`)
    .addField(":date: Criado Em: ", `${createdAt}`)
    .addField(`${get(Emojis.shield)} Nível de Verificação: `, `${vLevel}`)
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
    .addField(`${get("909892224362369086")} Membros: `, stripIndents`\`\`\`
    Total: ${memberServer[0]}
    Humanos: ${memberServer[2]}
    Bots: ${memberServer[1]}
    \`\`\`
    `
    )
    .addField(`${get("902892025307889664")} Emojis: `, stripIndents`\`\`\`
    Total: ${emojiServer[0]}
    Animados: ${emojiServer[1]}
    Inanimados: ${emojiServer[2]}
    \`\`\`
    `
    )
    .addField("Alguns Emojis: ", someEmojis)
    .setColor(color)
    .setTimestamp()
    .setFooter("Pág: 2/2");
  
  const rowNext = new MessageActionRow();
  const rowBack = new MessageActionRow();
  
  const buttonNext = new MessageButton()
    .setCustomId("next")
    .setEmoji(Emojis.next)
    .setStyle("PRIMARY");
    
    const buttonBack = new MessageButton()
    .setCustomId("back")
    .setEmoji(Emojis.back)
    .setStyle("PRIMARY");

  rowNext.addComponents([
    buttonNext.setDisabled(false),
    buttonBack.setDisabled(true)
  ]);
  
  rowBack.addComponents([
    buttonNext.setDisabled(true),
    buttonBack.setDisabled(false)
  ]);
  
  const msg = await message.reply({
    embeds: [pag1],
    components: [rowNext]
  });
  //-------------------------------------------------------------//
  
  
  
  //------------------------COLLECTOR----------------------------//
  const filter = async (i) => {
    return i.isButton() && i.message.id === msg.id;
  };
  
  const collector = msg.createMessageComponentCollector({
    filter: filter,
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
      embeds: [pag1.setFooter("Tempo de interação acabado.")],
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