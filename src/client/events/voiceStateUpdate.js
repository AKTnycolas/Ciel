/* eslint-disable max-len */

module.exports = async (client, oldState, newState) => {
  const player = client.vulkava.players.get(oldState.guild.id);
  const channel = client.channels.cache.get(player?.textChannelId);
  let trueEvent = "state change";

  if (!oldState.channelId && newState) trueEvent = "connected";
  else if (oldState && !newState.channelId) trueEvent = "disconnected";
  else if (oldState.channelId !== newState.channelId) trueEvent = "moved";

  if (trueEvent === "disconnected") {
    if (!player) return;
    if (oldState.id === client.user.id) return player.destroy();
    else await alone(oldState);
  }

  if (trueEvent === "moved") {
    if (!player) return;
    if (oldState.id === client.user.id) {
      await player.setVoiceChannel(newState.channelId);
      await alone(newState);
      return;
    } else if (oldState.channelId === player.voiceChannelId) await alone();
  }

  async function alone(state) {
    if (
      state.channel.members.size === 1 &&
      state.channel.members.get(client.user.id)
    ) {
      await channel.send(
        ":warning: Eu irei sair do canal em **1** minuto, caso ninguém aparecer!"
      );
      setTimeout(async () => {
        const currentChannel = client.channels.cache.get(player.voiceChannelId);

        if (
          currentChannel.members.size === 1 &&
          currentChannel.members.get(client.user.id)
        ) {
          await player.destroy();
          await channel.send(
            ":warning: Eu saí do canal de voz, pois só havia eu lá!"
          );
        }
      }, 60000);
    }
  }
};
