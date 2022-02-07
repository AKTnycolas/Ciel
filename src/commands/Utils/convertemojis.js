const cvt = require("../../utils/plugins/convertEmojis");

exports.run = async (client, message, args) => {
  message.reply(cvt(args.join(" ")));
};

exports.help = {
  name: "convertemojis",
  description: "Converta textos em emojis",
  aliases: ["cvt", "cve"],
  usage: "convertemojis [texto]",
  category: "Utils",
};
