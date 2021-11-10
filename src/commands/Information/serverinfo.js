const { MessageEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");
const { dateAndDay } = require("../../utils/plugins/dates");
const { get } = require("../../utils/acronyms");
const { serverinfo } = require("../../utils/plugins/buttons");
const { rowNext, rowBack } = serverinfo();

exports.run = async (client, message, args, { server }) => {
  
  //--------------------VARIÁVEIS BASES--------------------------// 
  const guild = message.guild;
  const icon = guild.iconURL({ dynamic: true });
  const color = process.env.colorEmbed;
  //-------------------------------------------------------------// 
  
  //-------------------EMBED1 VARIABLES--------------------------// 
  const owner = client.users.cache.get(guild.ownerId).tag;
  const mainLanguage = get(guild.preferredLocale);
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

  const createdAt = dateAndDay(guild.createdAt, { days: true });

  let vLevel = guild.verificationLevel;
  if (vLevel == "NOME") vLevel = "Nenhum";
  else if (vLevel == "LOW") vLevel = "Baixo";
  else if (vLevel == "MEDIUM") vLevel = "Médio";
  else if (vLevel == "HIGH") vLevel = "Alto";
  else vLevel = "Muito Alto";

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

  const someEmojis =
    `${emojis.map(x => x).slice(0, 26).join("**|**")}`||
    "Nenhum Emoji Encontrado";
  //-------------------------------------------------------------// 
  
  
  
  
  
  //-------------------------EMBEDS------------------------------// 
  
  const pag1 = new MessageEmbed()
    .setAuthor(guild.name, icon)
    .setThumbnail(icon)
    .addField("Nome: ", `${guild.name}`)
    .addField("Dono(a): ", `${owner}`)
    .addField("Idioma: ", `${mainLanguage}`)
    .addField("Meu prefixo: ", `**${server.prefix}**`)
    .addField("Minha Entrada: ", myEntry)
    .addField("Sua Entrada: ", yourEntry)
    .setColor(color)
    .setTimestamp()
    .setFooter("Pág: 1/2");
  
  
  const pag2 = new MessageEmbed()
    .setAuthor(guild.name, icon)
    .setThumbnail(icon)
    .addField("Id: ", `${guild.id}`)
    .addField("Boosts: ", `${totalBoost}`)
    .addField("Criado Em: ", `${createdAt}`)
    .addField("Nível de Verificação: ", `${vLevel}`)
    .addField("Canais: ", stripIndents`\`\`\`
    Total: ${channelServer[0]}
    Cartegorias: ${channelServer[1]}
    Texto: ${channelServer[2]}
    Voz: ${channelServer[3]}
    \`\`\`
    `
    )
    .addField("Presenças: ", stripIndents`\`\`\`
    Onlines: ${statuServer[0]}
    Ausentes: ${statuServer[1]}
    Não Pertube: ${statuServer[2]}
    Offline: ${statuServer[3]}
    \`\`\`
    `
    )
    .addField("Membros: ", stripIndents`\`\`\`
    Total: ${memberServer[0]}
    Humanos: ${memberServer[2]}
    Bots: ${memberServer[1]}
    \`\`\`
    `
    )
    .addField("Emojis: ", stripIndents`\`\`\`
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

  const msg = await message.reply({
    embeds: [pag1],
    components: [rowNext]
  });
  //-------------------------------------------------------------// 

  
  //--------------------------COLLECTOR--------------------------// 
  const filter = async i => {
    if (i.user.id === message.author.id) return true;
    else {
      await i.reply({
        content: "Só apenas quem executou o comando pode interagir com ele",
        ephemeral: true
      });
    }
  };

  const collector = message.channel.createMessageComponentCollector({
    filter,
    time: 25000
  });

  collector.on("collect", async i => {
    if (i.customId === "nextFromServerinfo") {
      await i.update({
        embeds: [pag2],
        components: [rowBack]
      });
    } else if (i.customId === "backFromServerinfo") {
      await i.update({
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
  //-------------------------------------------------------------// 
};


module.exports.help = {
  name: "serverinfo",
  description: "Veja as informações desse servidor",
  aliases: ["server", "info-server"],
  usage: "<prefix>serverinfo",
  category: "Information"
};