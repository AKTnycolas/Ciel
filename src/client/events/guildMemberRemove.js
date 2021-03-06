const cvt = require("../../utils/plugins/convertEmojis");

module.exports = async (client, member) => {
  const { Guild } = client.database;
  const guild = member.guild;
  const server = await Guild.findById(guild.id);

  if (server.welcome.toggle) {
    const channel = client.channels.cache.get(server.byebye.channel);

    const msg = server.byebye.message
      .replace(/{member}/g, `<@${member.id}>`)
      .replace(/{guild}/g, guild.name)
      .replace(/{membercount}/g, guild.memberCount);

    if (channel) channel.send(msg);
  }

  if (server.count.toggle) {
    const channel = client.channels.cache.get(server.count.channel);

    const msg = server.count.message.replace(
      /{contador}/g,
      cvt(guild.memberCount)
    );

    if (channel) channel.setTopic(msg);
  }
};
