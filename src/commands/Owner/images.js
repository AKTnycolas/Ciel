const { MessageEmbed } = require("discord.js");

exports.run = async (client, message, args) => {
  const { Image } = client.database;

  //---------------------LIST OF IMAGES-----------------------------//
  if (!args[0]) {
    const embed = new MessageEmbed()
      .setAuthor({
        name: "Lista de Images",
        iconURL: client.user.displayAvatarURL({ dynamic: true }),
      })
      .setColor(process.env.colorEmbed);

    const allCommands = await Image.find();

    for (const cmd of allCommands) {
      const images = cmd.images;
      if (images.length === 0) return;

      const value = images.map((cmd, index) => `[${index}](${cmd})`).join(", ");
      embed.addField(cmd._id, value);
    }

    return message.reply({
      embeds: [embed],
    });
  }
  //-------------------------------------------------------//

  //------------------ADDING AN IMAGE------------------//
  if (["add", "adicionar"].includes(args[0])) {
    if (!args[1]) return message.reply("Você não disse o nome do comando!");
    if (!args[2]) return message.reply("Você não passou a url!");
    if (!checkLink(args[2]))
      return message.reply(stripIndents`
      Essa não é uma url válida
      exemplo de url: \`\`\`https://imgur.com/bn8OCeZ.gif\`\`\`
      `);

    const cmd = client.commands.get(args[1] || client.aliases.get(args[1]));
    if (!cmd) return message.reply(`O comando **${args[1]}** não existe!`);

    let cmdData = await Image.findById(cmd.help.name);
    if (!cmdData) {
      cmdData = await Image.create({ _id: cmd.help.name });
    }

    cmdData.images.push(args[2]);
    await cmdData.save();

    const embed = new MessageEmbed()
      .setDescription("Essa imagem foi adicionada com sucesso!")
      .setImage(args[2])
      .setColor(process.env.colorEmbed);

    return message.reply({
      embeds: [embed],
    });
  }
  //-------------------------------------------------------//

  //------------------REMOVING AN IMAGE------------------//
  if (["remove", "remover"].includes(args[0])) {
    if (!args[1]) return message.reply("Você não disse o nome do comando!");
    if (!args[2]) return message.reply("Você não passou a url!");
    if (!checkLink(args[2])) return message.reply("Essa não é uma url válida!");

    const cmd = client.commands.get(args[1] || client.aliases.get[1]);
    if (!cmd) return message.reply(`O comando **${args[1]}** não existe!`);

    const cmdData = await Image.findById(cmd.help.name);

    if (!cmdData) {
      message.reply(
        `O comando **${cmd.help.name}** não possui nenhuma imagem!`
      );
      await Image.create({ _id: cmd.help.name });
      return;
    } else {
      remove(cmdData.images, args[2]);
      await cmdData.save();
      return message.reply("Ok, a imagem foi retirada com sucesso!");
    }
  }
  //-------------------------------------------------------//

  function checkLink(link) {
    const reg = /https:\/\/imgur.com\/([a-z0-9A-Z]{1,}).gif/gi;
    return reg.test(link);
  }

  function remove(array, link) {
    const position = array.indexOf(link);

    if (position > -1) {
      array.splice(position, 1);
    } else return false;
  }
};

exports.help = {
  name: "images",
  description: "Adicione ou remova uma imagem de um comando de diversão",
  aliases: ["image"],
  usage: "image [add|remove] [comando] [link]",
};
