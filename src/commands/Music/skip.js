exports.run = async (client, message) => {
  if (!message.member.voice.channelId)
    return message.reply("Primeiro você precisa entrar em um canal de voz!");

  const player = client.vulkava.players.get(message.guild.id);

  if (!player || message.member.voice.channelId !== player.voiceChannelId)
    return message.reply(
      "Eu não estou tocando nenhuma música nesse canal de voz!"
    );

  const author = message.author;
  const voice = message.member.voice.channel;
  const requester = player.current.requester;

  if (voice.members.get(requester.id)) {
    if (author.id !== requester.id)
      return message.reply(
        "O único que pode pular a música é que requisitou ela!" +
          `\n**Obs**: ${requester.tag}`
      );
  }
  
  message.react("✅");
  player.skip();
};

exports.help = {
  name: "skip",
  description: "Pule uma música",
  aliases: ["pular"],
  usage: "skip",
};
