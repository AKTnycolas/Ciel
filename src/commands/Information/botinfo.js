const { MessageEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");
const { parseIn } = require("../../utils/plugins/dates");

exports.run = async (client, message) => {
  const iconURL = client.user.displayAvatarURL({ dynamic: false });

  // github info
  const commit = await fetch(
    `https://api.github.com/repos/${process.env.repoPath}/commits`
  )
    .then((res) => res.json())
    .then((res) => res);

  const lastUpdate = parseIn(new Date(commit[0].commit.committer.date));

  const description = stripIndents`
  Olá, meu nome é ${client.user.username}, sou apenas um
  bot simples focado em facilitar sua vida e se divertir.
  
  > Fui Criado Por: **${client.users.cache.get(process.env.ownerId).tag}**
  > Narci Em: <t:${Math.ceil(client.user.createdAt.getTime() / 1000)}:f>
  > Tempo Acordado: **${parseIn(client.readyAt)}**
  > Número de usuários: **${client.users.cache.size}**
  > Número de Servidores: **${client.guilds.cache.size}**
  > Data Da Última Atualização: **${lastUpdate}**
  `;

  const embed = new MessageEmbed()
    .setAuthor({ name: "Meu Perfil", iconURL })
    .setThumbnail(iconURL)
    .setDescription(description)
    .setColor(process.env.colorEmbed);

  message.reply({ embeds: [embed] });
};

exports.help = {
  name: "botinfo",
  description: "Veja as minhas informações",
  aliases: ["bot", "infobot", "helpbot"],
  usage: "botinfo",
  category: "Information",
};
