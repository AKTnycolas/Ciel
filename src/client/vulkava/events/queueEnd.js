module.exports = (client, player) => {
  const channel = client.channels.cache.get(player.textChannelId);

  channel.send("Fila terminou!");
  player.destroy();
};
