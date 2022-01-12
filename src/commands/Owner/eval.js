const { MessageEmbed } = require("discord.js");
const { inspect } = require("util");

exports.run = async (client, message, args) => {
  
  //------------------------VERIFICATIONS------------------------//
  if (message.author.id !== process.env.ownerId) return;
  if (!args[0]) return message.reply("Nenhum Argumento Foi Passado");
  //-------------------------------------------------------------// 
  
  //---------------------------KEYWORDS--------------------------//
  const author = message.author;
  const member = message.member;
  const guild = message.guild;
  
  let code = args.join(" ");
  let result, type;
  //-------------------------------------------------------------//
  
  
  
  //---------------------COMMAND---------------------------------//
  try {
    result = type = eval(code);

    if (typeof result !== "string")
      result = inspect(result, { depth: 0 });
    if (result.length >= 1002)
      result = result.slice(0, 1002) + "...";
    
  } catch (err) {
    result = err.message;
    console.log(err.stack);
  };
  
  // embed 
  const embed = new MessageEmbed()
    .addField(":inbox_tray: Entrada: ", `\`\`\`js\n${code}\`\`\``)
    .addField(":outbox_tray: Saida: ", `\`\`\`js\n${result}\`\`\``)
    .addField(":thinking: Tipo de Saída: ", `\`\`\`\n${typeof type}\`\`\``)
    .setColor(process.env.colorEmbed);

  await message.reply({
    embeds: [embed]
  });
  
  
  
  //-------------------------------------------------------------//
  
  //----------------------USEFUL FUNCTIONS-----------------------//
  async function exit() {
    await message.reply("Desligando....");
    await client.destroy();
    process.exit();
  };
  //-------------------------------------------------------------//
};


exports.help = {
  name: "eval",
  description: "Executa codigos",
  aliases: [],
  usage: "eval [code]",
  category: "Owner"
};
