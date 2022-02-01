const { MessageEmbed, MessageButton, MessageActionRow } = require("discord.js");
const { stripIndents } = require("common-tags");
const { parseIn } = require("../../utils/plugins/dates");
const { cpus, totalmem } = require("os");
const { getter } = require("../../utils/emojis");
const pack = require("../../../package.json");

exports.run = async (client, message) => {
  //-----------------------BASIC VARIABLES-----------------------//
  const ownerTag = client.users.cache.get(process.env.ownerId).tag;
  const iconURL = client.user.displayAvatarURL({ dynamic: true });
  const Emojis = new getter(client);
  //-------------------------------------------------------------//

  //-----------------------EMBEDS VARIABLES----------------------//
  const totals = [
    client.users.cache.size,
    client.guilds.cache.size,
    client.commands.size,
  ];

  // dates
  const createdAt = `<t:${
    Math.ceil(client.user.createdAt.getTime() / 1000)
  }:f>`;
  const awakeTime = parseIn(new Date(client.readyAt));

  // cpu info
  const cpu = cpus()[0];
  const cpuModel = cpu.model.replace(/[(R)]/g, "");

  // memory information
  const memory = process.memoryUsage();
  const totalMemory = (totalmem() / 1024 / 1024).toFixed(2) + "MB";
  const usedMemory = (memory.heapUsed / 1024 / 1024).toFixed(2) + "MB";

  // github info
  const commit = await fetch(
    `https://api.github.com/repos/${process.env.repoPath}/commits`
  )
    .then((res) => res.json())
    .then((res) => res);

  const lastUpdate = new Date(commit[0].commit.committer.date);
  const formatLastUpdate = parseIn(lastUpdate);

  // version information
  const versionsPack = pack.dependencies;
  const myVersion = pack.version;
  const nodeVersion = process.version.replace("^", "").replace("v", "");
  const discordVersion = versionsPack["discord.js"].replace("^", "");
  const mongoDBVersion = versionsPack["mongoose"].replace("^", "");
  //-------------------------------------------------------------//

  //-------------------------DESCRIPTION-------------------------//
  const description = stripIndents`
  Olá, o meu nome é ${client.user.username} tenho
  15 anos e sou apenas um simples bot
  focado em facilitar e divertir a
  sua vida❤️
  
  ㅤ
  `;

  const botInfo = stripIndents`
  ${Emojis.get("programmer")} Minha Criadora: **${ownerTag}**
  :date: Nasci Em: **${createdAt}**
  ${Emojis.get("users")} Quantidade de Usuários: **${totals[0]}**
  ${Emojis.get("servers")} Quantidade de Servers: **${totals[1]}**
  :video_game: Total de Comandos: **${totals[2]}**
  :sleeping: Tempo Acordado: **${awakeTime}**
  ㅤ
  `;

  const hosting = stripIndents`
  :ping_pong: Ping do bot: **${client.ws.ping}ms**
  ${Emojis.get("cpu")} Modelo da Cpu: \`\`\`${cpuModel}\`\`\`
  ${Emojis.get("ram")} Memoria Total: **${totalMemory}**
  ${Emojis.get("ram")} Memória Usada: **${usedMemory}**
  ㅤ
  `;

  const versions = stripIndents`
  :date: Último Update: **${formatLastUpdate}**
  ${Emojis.get("versions")} Minha Versão: **${myVersion}**
  ${Emojis.get("nodejs")} Nodejs: **${nodeVersion}**
  ${Emojis.get("discord_theme_2")} Discord.js: **${discordVersion}**
  ${Emojis.get("mongoDB")} MongoDB: **${mongoDBVersion}**
  `;
  //-------------------------------------------------------------//

  //---------------------------EMBEDS----------------------------//
  const embed = new MessageEmbed()
    .setAuthor({ name: `Olá ${message.author.username}`, iconURL })
    .setDescription(description)
    .setThumbnail(iconURL)
    .addField("Informações do Bot: ", botInfo)
    .addField("Informações da Host: ", hosting)
    .addField("Informação das Versões: ", versions)
    .setColor(process.env.colorEmbed);

  const { me: invite, suport } = client.invites;

  const buttonInvite = new MessageButton()
    .setURL(invite)
    .setLabel("Me Adicione")
    .setEmoji(Emojis.get("heart_mine"))
    .setStyle("LINK");

  const buttonSuport = new MessageButton()
    .setURL(suport)
    .setLabel("Suporte")
    .setEmoji(Emojis.get("suport"))
    .setStyle("LINK");

  const rowInvites = new MessageActionRow().addComponents([
    buttonInvite,
    buttonSuport,
  ]);

  await message.reply({
    embeds: [embed],
    components: [rowInvites],
  });
  //-------------------------------------------------------------//
};

exports.help = {
  name: "botinfo",
  description: "Comando para ver às informações do bot",
  aliases: ["bot", "infobot", "helpbot"],
  usage: "botinfo",
  category: "Information",
};
