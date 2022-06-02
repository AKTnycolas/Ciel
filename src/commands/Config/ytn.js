exports.run = async (client, message, args, { server }) => {
  //-------------------SUB COMMANDS------------------------//
  const sub = client.subCommands.get("Ytn").get(args[0]);

  if (sub) {
    return sub(client, message, args, { server });
  }
  //-------------------------------------------------------//
};

exports.help = {
  name: "ytn",
  description: "Sistema de notificação do Youtube",
  aliases: ["youtubenotification", "youtubenoti"],
  usage: "ytn help",
  isSub: true,
  ref: "Ytn",
};
