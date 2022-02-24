const { MessageEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");
const { parseIn } = require("../../utils/plugins/dates");
const { cpus, totalmem, platform } = require("os");
const { getter } = require("../../utils/emojis");

exports.run = async (client, message) => {
  const Emojis = new getter(client);

  // github info
  const commit = await fetch(
    `https://api.github.com/repos/${process.env.repoPath}/commits`
  )
    .then((res) => res.json())
    .then((res) => res);

  const lastUpdate = parseIn(new Date(commit[0].commit.committer.date));

  // cpu info
  const model = cpus()[0].model.split(" ");
  const cpuModel = model.slice(0, 2).join(" ").replace(/[(R)]/g, "");
  const cpuSpeed = model.slice(-1);

  // memory information
  const memory = process.memoryUsage();
  const totalMemory = (totalmem() / 1024 / 1024).toFixed(2) + "MB";
  const usedMemory = (memory.heapUsed / 1024 / 1024).toFixed(2) + "MB";

  const botinfo = stripIndents`
  > Ping: **${client.ws.ping}ms**
  > Tempo Acordado: **${parseIn(client.readyAt)}**
  > Total de Usuários: **${client.users.cache.size}**
  > Total de Servidores: **${client.guilds.cache.size}**
  > Total de Comandos: **${client.commands.size}**
  > Último Update Foi: **${lastUpdate}**
  `;

  const hostinfo = stripIndents`
  > Plataforma: **${platform()}**
  > Modelo De Processador: **${cpuModel}**
  > Velocidade De Processamento: **${cpuSpeed}**
  > Memória Total: **${totalMemory}**
  > Memória Usada: **${usedMemory}**
  `;

  const embed = new MessageEmbed()
    .setThumbnail(Emojis.get("statistics").url)
    .addField("Informações Do Bot", botinfo)
    .addField("Informações Da Host", hostinfo)
    .setColor(process.env.colorEmbed);

  message.reply({ embeds: [embed] });
};

exports.help = {
  name: "status",
  description: "Veja as minhas estatísticas",
  aliases: ["sts", "estatísticas"],
  usage: "status",
};
