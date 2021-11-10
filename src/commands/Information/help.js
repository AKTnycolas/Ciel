const { MessageEmbed } = require("discord.js");
const { stripIndents } = require("common-tags");

exports.run = async (client, message, args) => {
  
  //---------------------COMMAND VARIABLES-----------------------//
  const icon = client.user.displayAvatarURL({ dynamic: true });

  let Config = [];
  let Information = [];
  let Owner = [];

  client.commands
    .map(cmd => cmd)
    .forEach(cmd => {
      const { category, name } = cmd.help;

      if (category == "Config") Config.push(name);
      if (category == "Information") Information.push(name);
      if (category == "Owner") Owner.push(name);
    });

  const categorys = {
    Config: "Configurações",
    Information: "Informações",
    Owner: "Owner"
  };

  const embed = new MessageEmbed()
    .setAuthor("Central De Comandos", icon)
    .setColor(process.env.colorEmbed);
  //.setTimestamp();
  //-------------------------------------------------------------//
  
  
  
  //--------------------------COMMAND----------------------------//
  if (args[0]) {
    const cmd = client.commands.get(client.aliases.get(args[0]) || args[0]);
    const { name, description, aliases, usage } = cmd.help;
    embed
      .addField("Nome Original: ", name)
      .addField("Descrição: ", description)
      .addField("Aliases: ", aliases.join(", "))
      .addField("Modo de Usar: ", usage);

    return message.reply({
      embeds: [embed]
    });
  } else {
    embed
      .setDescription(stripIndents`
        Procurando algum comando?, Aqui 
        estão todos eles:
        ㅤ
        `)
      .addField(
        `Configuração: (${Config.length})`,
        `\`\`\`${Config.sort().join(" - ")}\`\`\``
      )
      .addField(
        `Informação: (${Information.length})`,
        `\`\`\`${Information.sort().join(" - ")}\`\`\``
      )
      .addField(
        `Owners: (${Owner.length})`,
        `\`\`\`${Owner.sort().join(" - ")}\`\`\``
      );

    return message.reply({
      embeds: [embed]
    });
  }

  //-------------------------------------------------------------//
};

exports.help = {
  name: "help",
  description: "Veja a minha lista de Comandos",
  aliases: ["commands", "help-commands", "all-commands"],
  usafe: "<prefix>help <command>",
  category: "Information"
};
