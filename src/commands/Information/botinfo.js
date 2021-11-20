const { MessageEmbed, MessageButton, MessageActionRow } = require("discord.js");
const { stripIndents } = require("common-tags");
const { dateAndDay, parseIn } = require("../../utils/plugins/dates");
const { cpus, platform, totalmem } = require("os");
const Emojis = require("../../utils/emojis");
const pack = require("../../../package.json");

exports.run = async (client, message, args) => {
  
  //-----------------------BASIC VARIABLES-----------------------//
  const owner = client.users.cache.get(process.env.ownerId);
  const icon = client.user.displayAvatarURL({ dynamic: true });
  
  const get = (id) => {
    return client.emojis.cache.filter(x => x.id == id).first();
  }
  //-------------------------------------------------------------//

  //-----------------------EMBEDS VARIABLES----------------------//
  const totals = [
    client.users.cache.size,
    client.guilds.cache.size,
    client.commands.size
  ];
  
  // dates
  const createdAt = dateAndDay({ date: client.user.createdAt });
  const awakeTime = parseIn(new Date(client.readyAt));
  
  // cpu info
  const cpu = cpus()[0];
  const cpuModel = cpu.model;
  const cpuSpeed = cpu.speed + "GHz";
  
  // memory information
  const memory = process.memoryUsage();
  const totalMemory = (totalmem() / 1024 / 1024).toFixed(2) + "MB";
  const usedMemory = (memory.heapUsed / 1024 / 1024).toFixed(2) + "MB";
  
  // github info
  const commit = await fetch(
    `https://api.github.com/repos/${process.env.repoPath}/commits`
  )
    .then(res => res.json())
    .then(res => res);
    
  const lastUpdate = new Date(commit[0].commit.committer.date);
  const formatLastUpdate = parseIn(lastUpdate);
  
  // version information
  const versions = pack.dependencies;
  const myVersion = pack.version;
  const nodeVersion = process.version.replace("^", "").replace("v", "");
  const discordVersion = versions["discord.js"].replace("^", "");
  const mongoDBVersion = versions["mongoose"].replace("^", "")
  //-------------------------------------------------------------//

  //-------------------------DESCRIPTION-------------------------//
  // decription
  const description = stripIndents`
  Olá, o meu nome é ${client.user.username} tenho
  15 anos e sou apenas um simples bot
  focado em facilitar e divertir a
  sua vida❤️
  
  ㅤ
  `;

  const botInfo = stripIndents`
  ${get(Emojis.programmer)} Minha Criadora: **${owner.tag}**
  :date: Nasci Em: **${createdAt}**
  ${get(Emojis.users)} Quantidade de Usuários: **${totals[0]}**
  ${get(Emojis.servers)} Quantidade de Servers: **${totals[1]}**
  :video_game: Total de Comandos: **${totals[2]}**
  :sleeping: Tempo Acordado: **${awakeTime}**
  ㅤ
  `;

  const hosting = stripIndents`
  :ping_pong: Ping do bot: **${client.ws.ping}ms**
  ${get(Emojis.cpu)} Modelo da Cpu: \`\`\`${cpuModel}\`\`\`
  ${get(Emojis.ram)} Memoria Total: **${totalMemory}**
  ${get(Emojis.ram)} Memória Usada: **${usedMemory}**
  ㅤ
  `;

  const version = stripIndents`
  ${/*get(Emojis.update)*/":date:"} Último Update: **${formatLastUpdate}**
  ${get(Emojis.versions)} Minha Versão: **${myVersion}**
  ${get(Emojis.nodejs)} Nodejs: **${nodeVersion}**
  ${get(Emojis.discord_theme_2)} Discord.js: **${discordVersion}**
  ${get(Emojis.mongoDB)} MongoDB: **${mongoDBVersion}**
  `;
  //-------------------------------------------------------------//

  //---------------------------EMBEDS----------------------------//
  const embed = new MessageEmbed()
    .setAuthor(`Olá ${message.author.username}`, icon)
    .setDescription(description)
    .setThumbnail(icon)
    .addField("Informações do Bot: ", botInfo)
    .addField("Informações da Host: ", hosting)
    .addField("Informações das Versões: ", version)
    .setColor(process.env.colorEmbed);
  
  const invite = `https://discord.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=8`;
  const suport = "https://discord.gg/V9NQbXWqUs";
    
  const buttonInvite = new MessageButton()
    .setURL(invite)
    .setLabel("Me Adicione")
    .setEmoji(Emojis.heart_mine)
    .setStyle("LINK");

  const buttonSuport = new MessageButton()
    .setURL(suport)
    .setLabel("Servidor De Suporte")
    .setEmoji(Emojis.suport)
    .setStyle("LINK");
  
  const rowInvites = new MessageActionRow().addComponents([
    buttonInvite,
    buttonSuport
  ]);

  await message.reply({
    embeds: [embed],
    components: [rowInvites]
  });
  //-------------------------------------------------------------//
};

exports.help = {
  name: "botinfo",
  description: "Comando para ver às informações do bot",
  aliases: ["bot", "infobot", "helpbot"],
  usage: "botinfo",
  category: "Information"
};
