const { MessageEmbed, Util } = require("discord.js");

exports.run = (client, message, args) => {
  if (message.author.id !== "822819247146663936") return;
  if (!args[0]) return;

  try {
    const code = args.join(" ");
    let result = eval(code);

    if (typeof result !== "string")
      result = require("util").inspect(result, { depth: 0 });

    if (result.length >= 1002) result = result.slice(0, 1002) + "...";

    const embed = new MessageEmbed()
      .addField("Entrada: ", `\`\`\`js\n${code}\`\`\``)
      .addField("Saida: ", `\`\`\`js\n${result}\`\`\``)
      .setColor(process.env.colorEmbed);

    message.reply({ embeds: [embed] });
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
  aliases: ["ev"]
};
