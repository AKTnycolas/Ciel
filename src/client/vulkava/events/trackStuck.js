module.exports = async (client, player, track) => {
  await client.channels.cache
    .get(player.textChannelId)
    .send(`Aconteceu algum bug ao tentar tocar a música \`${track.title}\``);
};
