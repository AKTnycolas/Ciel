const { MessageEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");
const { dateAndDay, parseIn } = require("../../utils/plugins/dates");
const pack = require("../../../package.json");
const { cpus, platform, totalmem } = require("os");

const { invites } = require("../../utils/plugins/buttons");

exports.run = async (client, message, args) => {
  try {
  //-----------------------BASIC VARIABLES-----------------------//
  const rowInvites = invites(client);
  const author = message.author;
  const owner = client.users.cache.get("822819247146663936");
  const icon = client.user.displayAvatarURL({ dynamic: true });
  const color = process.env.colorEmbed;
  //-------------------------------------------------------------//

  //-----------------------EMBEDS VARIABLES----------------------//
  const totals = [
    client.users.cache.size,
    client.guilds.cache.size,
    client.commands.size
  ];

  const createdAt = dateAndDay({ date: client.user.createdAt });
  const awakeTime = parseIn(new Date(client.readyAt));
  const cpu = cpus()[0];
  const cpuModel = cpu.model;
  const cpuSpeed = cpu.speed + "GHz";

  const memory = process.memoryUsage();
  const totalMemory = (totalmem() / 1024 / 1024).toFixed(2) + "MB";
  const usedMemory = (memory.heapUsed / 1024 / 1024).toFixed(2) + "MB";

  const commit = await fetch(
    "https://api.github.com/repos/antonioalbert0/legends-of-idleon-bot/commits"
  )
    .then(res => res.json())
    .then(res => res);
    
  const lastUpdate = new Date(commit[0].commit.committer.date);
  const formatLastUpdate = parseIn(lastUpdate);
    
  const versions = pack.dependencies;
  const myVersion = pack.version;
  const nodeVersion = pack.engines.node.replace("^", "");
  const discordVersion = versions["discord.js"].replace("^", "");
  const mongoDBVersion = versions["mongoose"].replace("^", "")
  //-------------------------------------------------------------//

  //-------------------------DESCRIPTION-------------------------//
  // decription
  const description = stripIndents`
  Olá, o meu nome é ${client.user.username}
  ou você pode apenas me chamar de Promo, tenho 15 anos e sou
  apenas um simples bot focado no jogo [legends of idleon](https://www.legendsofidleon.com)
  
  ㅤ
  `;

  const botInfo = stripIndents`
  Meu Criador: **${owner.tag}**
  Nasci Em: **${createdAt}**
  Quantidade de Usuários: **${totals[0]}**
  Quantidade de Servers: **${totals[1]}**
  Total de Comandos: **${totals[2]}**
  Tempo Acordado: **${awakeTime}**
  ㅤ
  `;

  const hosting = stripIndents`
  Ping do bot: **${client.ws.ping}ms**
  Sitema Operacional: **${platform}**
  Modelo da Cpu: \`\`\`${cpuModel}\`\`\`
  Velocidade da Cpu: **${cpuSpeed}**
  Memoria Total: **${totalMemory}**
  Memória Usada: **${usedMemory}**
  ㅤ
  `;

  const version = stripIndents`
  Último Update: **${formatLastUpdate}**
  Minha Versão: **${myVersion}**
  Nodejs: **${nodeVersion}**
  Discord.js: **${discordVersion}**
  MongoDB: **${mongoDBVersion}**
  `;
  //-------------------------------------------------------------//

  //---------------------------EMBEDS----------------------------//
  const embed = new MessageEmbed()
    .setAuthor(`Olá ${author.username}`, icon)
    .setDescription(description)
    .setThumbnail(icon)
    .addField("Informações do Bot: ", botInfo)
    .addField("Informações da Host: ", hosting)
    .addField("Informações das Versões: ", version)
    .setColor(color);

  await message.reply({ embeds: [embed], components: [rowInvites] });
  } catch (err) {
    message.reply(err.message);
  }
  //-------------------------------------------------------------//
};

exports.help = {
  name: "botinfo",
  description: "Comando para ver às informações do bot",
  aliases: ["bot", "infobot", "helpbot"],
  usage: "<prefix>botinfo",
  category: "Information"
};
