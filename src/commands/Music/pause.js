exports.run = async (client, message) => {
  if (!message.member.voice.channelId)
    return message.reply("Primeiro você precisa entrar em um canal de voz!");

  const player = client.vulkava.players.get(message.guild.id);

  if (!player || message.member.voice.channelId !== player.voiceChannelId)
    return message.reply(
      "Eu não estou tocando nenhuma música nesse canal de voz!"
    );

  message.react("🔇");
  player.pause(!player.paused);
};

exports.help = {
  name: "pause",
  description: "Pause a música",
  aliases: ["pausar"],
  usage: "pause",
  category: "Music",
};
