const { Vulkava } = require("vulkava");

module.exports = {
  async start(client) {
    // this is a public lavalink, I used it for demo
    client.vulkava = new Vulkava({
      nodes: [
        {
          id: "Node 1",
          hostname: "losingtime.dpaste.org",
          port: 2124,
          password: "SleepingOnTrains",
          secure: false,
        },
      ],
      sendWS: (guildId, payload) => {
        const guild = client.guilds.cache.get(guildId);
        if (guild) guild.shard.send(payload);
      },
    });
  },
};
