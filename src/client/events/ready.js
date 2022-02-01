/* eslint-disable max-len */
const { Permissions } = require("discord.js");

module.exports = async (client) => {
  const { Image } = client.database;
  
  const sentences = [
    { name: "a live do piuzinho", type: "WATCHING" },
    { name: "os tente não rir da amora", type: "WATCHING" },
    { name: "os vídeos do sr carlinhos", type: "WATCHING" },
    { name: "os vídeos do Goulart", type: "WATCHING" },

    { name: "lofi", type: "LISTENING" },
    { name: "as músicas do VMZ", type: "LISTENING" },
    { name: "as músicas do Sadstation", type: "LISTENING" },
    { name: "as suas belas vozes", type: "LISTENING" },

    { name: "Minicreft", type: "PLAYING" },
    { name: "Free fire", type: "PLAYING" },
    { name: "Gta 5", type: "PLAYING" },
    { name: "Among Us", type: "PLAYING" },

    {
      name: "um ring virtual contra os melhores Bots da atualidade",
      type: "COMPETING",
    },
    { name: "um campeonato de xadrez com os humanos, kkkk", type: "COMPETING" },
    { name: "um x1 contra o meu criador", type: "COMPETING" },
    {
      name: "um jogo onde eu quero ser a top 1 do rank de melhores bot",
      type: "COMPETING",
    },

    { name: "YouTube", type: "STREAMING" },
    { name: "Twitch", type: "STREAMING" },
    { name: "Nimo", type: "STREAMING" },
    { name: "Booyah", type: "STREAMING" },

    { name: `Olá eu me chamo ${client.user.username}`, type: "PLAYING" },
    {
      name: `Tag da minha criadora ${client.users.cache.get(process.env.ownerId).tag}`,
      type: "PLAYING",
    },
  ];

  setInterval(() => {
    const random = sentences[Math.floor(Math.random() * sentences.length)];
    client.user.setActivity(`${random.name}`, { type: `${random.type}` });
  }, 20000);

  // taking the avatars
  const avatars = await Image.findById("avatar");
  if (!avatars.images[0]) avatars.image = ["https://imgur.com/JEXfUMX.png"];

  setInterval(() => {
    const random = avatars.images[Math.floor(Math.random() * avatars.length)];
    client.user.setAvatar(random);
  }, 600000);

  // links
  const guild = client.guilds.cache.get(process.env.supportGuild);
  let suport = guild.invites.cache.find((i) => i.maxAge === 0);

  if (!suport) {
    const randomChannel = guild.channels.cache.first();
    const link = await guild.invites.create(randomChannel.id, { maxAge: 0 });
    suport = link;
  }

  client.invites = {
    me: client.generateInvite({
      scopes: ["bot"],
      permissions: [Permissions.FLAGS.ADMINISTRATOR],
    }),
    suport: suport.url,
  };

  // setting some things
  require("../../utils/plugins/getUser")(client);
  client.user.setStatus("dnd");
  console.log("ESTOU ON!");
};
