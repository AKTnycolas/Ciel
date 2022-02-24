const { MessageEmbed } = require("discord.js");
const { cooldown } = require("../../utils/plugins/dates");
const { getter } = require("../../utils/emojis");

exports.run = async (client, message, args) => {
  //-------------------BASE VARIABLES----------------------//
  const Emojis = new getter(client);
  const { author, member, guildId, channelId } = message;
  //-------------------------------------------------------//

  //-------------------BASIC CHECKS------------------------//
  if (!member.voice.channel)
    return message.reply("Primeiro você precisa entrar em um canal de voz!");

  const playerTest = client.vulkava.players.get(guildId);

  if (playerTest)
    if (member.voice.channelId !== playerTest.voiceChannelId)
      return message.reply("Você precisa está no mesmo canal de voz que eu!");
    else if (playerTest.paused && !args[0]) {
      return playerTest.pause(false);
    }
  //-------------------------------------------------------//

  //------------------SEARCHING THE MUSIC------------------//
  const track = args.join(" ");
  if (!track)
    return message.reply("Você não disse o nome/passou o link da música!");

  const res = await client.vulkava.search(track);

  if (res.loadType === "LOAD_FAILED") {
    console.log(res);
    return message.reply("Aconteceu algum error ao tentar carregar a música");
  } else if (res.loadType === "NO_MATCHES") {
    return message.reply("Nenhum resultado encontrado!");
  }
  //-------------------------------------------------------//

  //-----------------CREATING THE PLAYER-------------------//
  const player = client.vulkava.createPlayer({
    guildId: guildId,
    voiceChannelId: member.voice.channelId,
    textChannelId: channelId,
    selfDeaf: true,
  });

  player.connect();
  //-------------------------------------------------------//

  //-------------PUTTING THE SONGS IN THE QUEUE------------//
  if (res.loadType === "PLAYLIST_LOADED") {
    const playlist = res.playlistInfo;
    const musics = res.tracks;

    for (const music of musics) {
      music.setRequester(author);
      player.queue.push(music);
    }

    const embed = new MessageEmbed()
      .setAuthor({
        name: "Playlist Adicionada A Fila",
        iconURL: Emojis.get("playlist").url,
      })
      .addField(":pencil: Título: ", playlist.name)
      .addField(":notes: Total de Músicas: ", musics.length.toString())
      .addField(":hourglass: Duração: ", cooldown(new Date(playlist.duration)))
      .setColor(process.env.colorEmbed);

    message.reply({ embeds: [embed] });
  } else {
    const music = res.tracks[0];
    music.setRequester(author);

    player.queue.push(music);
    message.reply(
      `A música \`${music.title}\` foi adicionada a fila`
    );
  }
  //-------------------------------------------------------//

  // playing the song
  if (!player.playing) player.play({ noReplace: true });
};

exports.help = {
  name: "play",
  description: "Toque uma música",
  aliases: ["tocar"],
  usage: "play [nome/url]",
  category: "Music",
};
