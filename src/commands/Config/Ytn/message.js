const { codeBlock } = require("@discordjs/builders");
const { getChannelInfo } = require("yt-channel-info");
const { getter } = require("../../../utils/emojis");
const {
  MessageEmbed,
  MessageActionRow,
  MessageSelectMenu,
} = require("discord.js");

async function Message(client, message) {
  if (!message.member.permissions.has("MANAGE_GUILD"))
    return message.reply("Você não tem a permissão **MANAGER_GUILD**!");

  //---------------------BASE VARIABLES----------------------//
  const Emojis = new getter(client);
  const Channel = client.database.Channel;
  const guildId = message.guildId;

  const channels = await Channel.find({ "servers.serverId": guildId });
  if (!channels) return message.reply("Nenhum canal encontrado!");
  //---------------------------------------------------------//

  //-------------------CREATE THE FIELDS---------------------//
  const fields = [];
  const options = [];

  for (const channel of channels) {
    const server = channel.servers.find((srv) => srv.serverId === guildId);
    const channelDoc = await getChannelInfo({ channelId: channel._id });

    const field = {
      name: channelDoc.author,
      value: codeBlock("js", server.message),
    };

    fields.push(field);

    // creating the option in the menu
    const option = {
      label: channelDoc.author,
      description: server.message,
      value: channel.id,
    };

    options.push(option);
  }
  //----------------------------------------------------//

  //----------CREATING THE EMBED AND THE MENU-----------//
  const embed = new MessageEmbed()
    .setAuthor({
      name: "Todas as mensagens dos canais:",
      iconURL: Emojis.get("youtube").url,
    })
    .setThumbnail(Emojis.get("ytnotif").url)
    .addFields(fields)
    .setColor(process.env.colorEmbed);

  const row = new MessageActionRow().addComponents(
    new MessageSelectMenu()
      .setCustomId("menu")
      .setPlaceholder("Escolha os canais")
      .setMinValues(1)
      .setMaxValues(channels.length)
      .addOptions(options)
  );

  const msg = await message.reply({ embeds: [embed], components: [row] });
  //----------------------------------------------------//
  /*
  
  
  
  */
  //~~~~~~~~~~~~~~~~~~~~~~~COLLECTOR~~~~~~~~~~~~~~~~~~~~~//
  const collector = msg.createMessageComponentCollector({
    componentType: "SELECT_MENU",
    time: 120000,
  });

  collector.on("collect", async (interaction) => {
    if (interaction.user.id !== message.author.id) {
      await interaction.reply({
        content: "Apenas quem executou o comando pode usar ele",
        ephemeral: true,
      });
      return;
    }

    const chosenChannels = interaction.values;

    //------------------MESSAGE COLLECTOR-----------------//
    const messageCollector = message.channel.createMessageCollector({
      filter: (m) => m.author.id === interaction.user.id,
      time: 120000,
      max: 1,
    });

    await msg.edit({
      content: "**Escreva no chat a nova mensagem:**",
      embeds: [],
      components: [],
    });

    messageCollector.on("collect", async (i) => {
      const newMessage = i.content;

      if (!/{{link}}/.test(newMessage))
        return message.reply("É necessário que o {{link}} esteja na mensagem!");

      //-----------------SETTING THE MESSAGE-----------------//
      for (const channelId of chosenChannels) {
        const channel = await channels.find((chn) => chn._id === channelId);

        const server = channel.servers.find((srv) => srv.serverId === guildId);
        server.message = newMessage;

        const newServers = channel.servers.filter(
          (srv) => srv.serverId !== guildId
        );
        newServers.push(server);

        await Channel.findByIdAndUpdate(channelId, {
          servers: newServers,
        });
      }
      message.reply("Mensagem setada com sucesso!");
      //----------------------------------------------------//
    });

    messageCollector.on("end", async () => {
      await msg
        .edit({
          content: "Tempo de interação acabou!",
        })
        .catch((o_O) => o_O);

      setTimeout(async () => await msg.delete(), 5000);
    });
    //----------------------------------------------------//
  });

  collector.on("end", async () => {
    await msg
      .edit({
        content: "Tempo de interação acabou",
        embeds: [],
        components: [],
      })
      .catch((o_O) => o_O);
  });
  //----------------------------------------------------//
}

module.exports = Message;
