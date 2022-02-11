const { MessageEmbed, MessageButton, MessageActionRow } = require("discord.js");
const { getter } = require("../../utils/emojis");

exports.run = async (client, message, args) => {
  if (!args[0]) return message.reply("Você não disse o nome do usuário!");

  const Emojis = new getter(client);
  
  const authorTestName = encodeURIComponent(args.join(" "));
  const author = await fetch(`https://api.github.com/users/${authorTestName}`)
    .then((res) => res.json())
    .then((res) => res);
  
  if (!author?.name) return message.reply("Esse usuário não foi encontrado ¯\\_(ツ)\_/¯");

  const {
    avatar_url,
    html_url,
    repos_url,
    type,
    name,
    company,
    bio,
    public_repos,
    followers,
    following,
    created_at,
    updated_at,
    login,
    id
  } = author;

  let createdAt = new Date(created_at);
  createdAt = `<t:${Math.ceil(createdAt.getTime() / 1000)}:f>`;
  let updateAt = new Date(updated_at);
  updateAt = `<t:${Math.ceil(updateAt.getTime() / 1000)}:f>`;

  //-----------------------EMBEDS--------------------------//
  const pag1 = new MessageEmbed()
    .setAuthor({ name, iconURL: avatar_url, url: html_url })
    .setThumbnail(avatar_url)
    .addField(`${Emojis.get("name")} Nome: `, name)
    .addField(`${Emojis.get("description")} Bio: `, bio ?? "Nenhuma bio")
    .addField(":office: Companhia: ", company ?? "Nenhuma companhia")
    .addField(":date: Data De Criação: ", createdAt)
    .addField(":date: Último Update: ", updateAt)
    .setColor(process.env.colorEmbed)
    .setFooter({ text: "Pág 1/2" });

  const pag2 = new MessageEmbed()
    .setAuthor({ name, iconURL: avatar_url, url: html_url })
    .setThumbnail(avatar_url)
    .addField(`${Emojis.get("name")} Nome da Conta: `, login)
    .addField(":id: Id: ", id.toString())
    .addField(`${Emojis.get("followers")} Seguidores: `, followers.toString())
    .addField(`${Emojis.get("following")} Seguindo: `, following.toString())
    .addField(`${Emojis.get("repos")} Repositórios Público: `, public_repos.toString())
    .setColor(process.env.colorEmbed)
    .setFooter({ text: "Pág: 2/2" });

  const rowNext = new MessageActionRow().addComponents([
    new MessageButton()
      .setCustomId("next")
      .setEmoji(Emojis.get("next"))
      .setStyle("PRIMARY"),
    new MessageButton()
      .setCustomId("back")
      .setEmoji(Emojis.get("back"))
      .setStyle("PRIMARY")
      .setDisabled(true),
  ]);

  const rowBack = new MessageActionRow().addComponents([
    new MessageButton()
      .setCustomId("next")
      .setEmoji(Emojis.get("next"))
      .setStyle("PRIMARY")
      .setDisabled(true),
    new MessageButton()
      .setCustomId("back")
      .setEmoji(Emojis.get("back"))
      .setStyle("PRIMARY"),
  ]);

  const msg = await message.reply({
    embeds: [pag1],
    components: [rowNext],
  });
  //-------------------------------------------------------//

  //--------------------COLETORES--------------------------//
  const filter = (interaction) => {
    return interaction.isButton() && interaction.message.id === msg.id;
  };

  const collector = msg.createMessageComponentCollector({
    filter: filter,
    time: 45000,
  });

  collector.on("collect", async (i) => {
    if (i.user.id !== message.author.id) {
      return i.reply({
        content: "Só apenas quem executou o comando pode interagir com ele",
        ephemeral: true,
      });
    }

    if (i.customId === "next") {
      await msg
        .edit({
          embeds: [pag2],
          components: [rowBack],
        })
        .catch((o_O) => o_O);
    } else if (i.customId === "back") {
      await msg
        .edit({
          embeds: [pag1],
          components: [rowNext],
        })
        .catch((o_O) => o_O);
    }
  });

  collector.on("end", async () => {
    await msg
      .edit({
        embeds: [pag1.setFooter({ text: "Tempo de Interação Acabado" })],
        components: [],
      })
      .catch((o_O) => o_O);
  });
  //-------------------------------------------------------//
};

exports.help = {
  name: "github",
  description: "Veja as informações de um usuário do github",
  aliases: [],
  usage: "github [nome de usuário]",
  category: "Utils",
};
