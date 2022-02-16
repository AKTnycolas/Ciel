module.exports = async (client, guild) => {
  await client.database.Guild.create(guild.id);
};
