module.exports = async (client, guild) => {
  await client.database.Guild.create({ _id: guild.id });
};
