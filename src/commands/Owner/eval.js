const { MessageEmbed, Util } = require("discord.js");
const { inspect } = require("util");

exports.run = (client, message, args) => {
  if (message.author.id !== "822819247146663936") return;
  if (!args[0]) return;

  try {
    // palavras chaves
    const author = message.author;
    const guild = message.guild;
    const member = message.member;

    // code
    const code = args.join(" ");
    let result = eval(code);

    const color = process.env.colorEmbed;

    if (typeof result !== "string") result = inspect(result, { depth: 0 });
    if (result.length >= 1002) result = result.slice(0, 1002) + "...";

    const embed = new MessageEmbed()
      .addField("Entrada: ", `\`\`\`js\n${code}\`\`\``)
      .addField("Saida: ", `\`\`\`js\n${result}\`\`\``)
      .setColor(color);

    message.reply({
      embeds: [embed]
    });
  } catch (err) {
    message.reply(err.message);
  }
  // utils
  async function exit() {
    await message.reply("Desligando...");
    process.exit();
  }
};

module.exports.help = {
  name: "eval",
  description: "Executa codigos",
  aliases: [],
  usage: "<prefix>eval [code]",
  category: "Owner"
};
