const { Permissions } = require("discord.js");

module.exports = async (client) => {
  // setting the status
  client.user.setActivity("Lofi", { type: "LISTENING" });

  const guild = client.guilds.cache.get(process.env.supportGuild);
  let suport = guild.invites.cache.find((i) => i.maxAge === 0);

  if (!suport) {
    const randomChannel = await guild.channels.cache.find(chn => chn.isText());
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
  client.vulkava.start(client.user.id);
  console.log("[VULKAVA] - conectado ao lavalink");
  console.log("ESTOU ON!");
};
