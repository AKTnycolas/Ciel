module.exports = client => {
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

    { name: "um ring virtual contra os melhores Bots da atualidade", type: "COMPETING" },
    { name: "um campeonato de xadrez com os humanos, kkkk", type: "COMPETING" },
    { name: "um x1 contra o meu criador", type: "COMPETING" },
    { name: "um jogo onde eu quero ser a top 1 do rank de melhores bot", type: "COMPETING" },

    { name: "YouTube", type: "STREAMING" },
    { name: "Twitch", type: "STREAMING" },
    { name: "Nimo", type: "STREAMING" },
    { name: "Booyah", type: "STREAMING" },

    { name: `Olá eu me chamo ${client.user.username}`, type: "PLAYING" },
    { name: `Tag da minha criadora ${client.users.cache.get("822819247146663936").tag}`, type: "PLAYING" },
    { name: "Me chame para seu servidor https://is.gd/CielBot", type: "PLAYING" },
    { name: "Entre o meu servidor de suporte https://is.gd/CielSuport", type: "PLAYING" }
  ];
  
  const avatars = [
    "https://media.discordapp.net/attachments/865774240926400512/908545373499453470/images_2.jpeg",
    "https://media.discordapp.net/attachments/865774240926400512/908545353505198160/images.jpeg",
    "https://media.discordapp.net/attachments/865774240926400512/930956652323172402/be5ced152cd1da334ab33d2e74f6508e.jpeg,",
    "https://media.discordapp.net/attachments/865774240926400512/930956661462552636/images_1.jpeg",
    "https://media.discordapp.net/attachments/865774240926400512/930956671667273798/images.jpeg"
  ];
  
  client.user.setStatus("dnd");

  setInterval(() => {
    const random = sentences[Math.floor(Math.random() * sentences.length)];
    client.user.setActivity(`${random.name}`, { type: `${random.type}` });
  }, 20000);
  
  setInterval(() => {
    const random = avatars[Math.floor(Math.random() * avatars.length)];
    client.user.setAvatar(random);
  }, 600000);

  console.log("ESTOU ON!");
};
