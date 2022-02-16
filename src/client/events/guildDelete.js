module.exports = async (client, guild) => {
  await client.database.Guild.deleteOne({ _id: guild.id });
};
