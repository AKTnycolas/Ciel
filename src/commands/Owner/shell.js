const { MessageEmbed } = require("discord.js");
const { exec } = require("child_process");
const { stripIndents } = require("common-tags");

exports.run = async (client, message, args) => {
  
  //------------------------VERIFICATIONS------------------------//
  if (message.author.id !== process.env.ownerId) return;
  if (!args[0]) return message.reply("Nenhum Argumento Foi Passado");
  //-------------------------------------------------------------//


  //---------------------COMMAND---------------------------------//
  const cmd = args.join(" ");
  console.log(cmd);

  function call(err, result, err2) {
    result = ((err?.message ?? err2.message) ?? result);
    if (result.length > 1002) result = result.slice(0, 1002) + "...";
    result = stripIndents(result);

    const embed = new MessageEmbed()
      .addField(":inbox_tray: Entrada: ", `\`\`\`js\n${cmd}\`\`\``)
      .addField(":outbox_tray: Saida: ", `\`\`\`js\n${result}\`\`\``)
      .setColor(process.env.colorEmbed);

    message.reply({
      embeds: [embed]
    });
  }

  await exec(cmd, call);
  //-------------------------------------------------------------//
};

exports.help = {
  name: "shell",
  description: "Executa codigos no terminal",
  aliases: [],
  usage: "shell [code]",
  category: "Owner"
};
