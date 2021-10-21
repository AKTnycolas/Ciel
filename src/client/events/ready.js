module.exports = client => {
  
  const sentences = [
    { name: "a live do lava", type: "WATCHING" },

    { name: "Legends of idleon", type: "PLAYING" },
  
    { name: "YouTube", type: "STREAMING" },
    { name: "Twitch", type: "STREAMING" },
    { name: "Nimo", type: "STREAMING" },

    { name: `Olá eu me chamo ${client.user.username}`, type: "PLAYING" },
    { name: `Tag do meu criador ${client.users.cache.get("822819247146663936").tag}`, type: "PLAYING" },
    { name: "Me chame para seu servidor https://is.gd/JeEt6C", type: "PLAYING" },
    { name: "Entre o meu servidor de suporte https://is.gd/BZLZJG", type: "PLAYING" }
  ]
  
  client.user.setStatus("dnd");
  
  setInterval(() => {
    const random = sentences[Math.floor(Math.random() * sentences.length)]
    client.user.setActivity(`${random.name}`, { type: `${random.type}` })
  }, 20000);
  
  console.log("ESTOU ON!");
};
