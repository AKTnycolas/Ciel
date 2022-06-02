const { MessageEmbed, MessageActionRow, MessageButton } = require("discord.js");
const { getChannelInfo } = require("yt-channel-info");
const { getter } = require("../../../utils/emojis");
const { stripIndents } = require("common-tags");

async function removeurl(client, message) {
  if (!message.member.permissions.has("MANAGE_GUILD"))
    return message.reply("Você não tem a permissão **MANAGER_GUILD**!");

  //---------------------ASE VARIABLES---------------------------//
  const Emojis = new getter(client);
  const Channel = client.database.Channel;
  const guildId = message.guildId;

  let channels = await Channel.find({ "servers.serverId": guildId });
  //-------------------------------------------------------------//

  //------------------RELOAD THE COMMAND-------------------------//
  async function createFieldsAndButtons() {
    if (!channels.length) return [0, 0, 1];

    const fields = ["Aqui está a lista de todos os canais registrados:"];
    const buttons = [];
    let counter = 0;

    // create channels and buttons
    for (const channel of channels) {
      const channelId = channel._id;
      const noValue = "Nenhuma Informação";

      let channelDoc;
      try {
        channelDoc = await getChannelInfo({ channelId });
      } catch (error) {}

      const field = `
      > Nome: ${channelDoc.author || noValue}
      > Inscritos: ${channelDoc.subscriberText || noValue}\n
      `;

      const button = new MessageButton()
        .setCustomId(counter.toString())
        .setLabel(channelDoc.author.substr(0, 22) || counter.toString())
        .setEmoji(Emojis.get("bin"))
        .setStyle("DANGER");

      fields.push(field);
      buttons.push(button);

      counter++;
    }

    const embed = new MessageEmbed()
      .setAuthor({
        name: "Sistema De Notificação do Youtube",
        iconURL: Emojis.get("youtube").url,
      })
      .setThumbnail(Emojis.get("bin").url)
      .setDescription(stripIndents`${fields.join("\n\n")}`)
      .setColor(process.env.colorEmbed);

    const row = new MessageActionRow().addComponents(buttons);

    return [embed, row];
  }
  //-------------------------------------------------------------//

  //---------------------FIRST SHIPMENT--------------------------//
  const data = await createFieldsAndButtons();
  const [embed, row, error] = data;

  if (error) return message.reply("Não existe canais para excluir!");

  const msg = await message.reply({ embeds: [embed], components: [row] });
  //-------------------------------------------------------------//

  //-----------------------COLLECTOR-----------------------------//
  const collector = msg.createMessageComponentCollector({
    componentType: "BUTTON",
    time: 60000,
  });

  collector.on("collect", async (i) => {
    if (i.user.id !== message.author.id) {
      return i.reply({
        content: "Só apenas quem executou o comando pode interagir com ele",
        ephemeral: true,
      });
    }

    const channel = channels[i.customId];
    channel.servers = channel.servers.filter((srv) => srv.serverId !== guildId);
    channels = channels.filter((cnl) => cnl._id !== channel._id);

    await Channel.findByIdAndUpdate(channel._id, {
      servers: [...channel.servers],
    });

    const newData = await createFieldsAndButtons();
    const [newEmbed, newRow] = newData;

    if (newEmbed && newRow) {
      await msg.edit({ embeds: [newEmbed], components: [newRow] });
    } else {
      await msg.delete();
    }

    await i.reply({
      content: "Canal excluído com sucesso!",
      ephemeral: true,
    });
  });

  collector.on("end", async () => {
    await msg
      .edit({
        content: "Tempo de Interação Acabado",
        embeds: [],
        components: [],
      })
      .catch((o_O) => o_O);
  });
  //-------------------------------------------------------//
}

module.exports = removeurl;
