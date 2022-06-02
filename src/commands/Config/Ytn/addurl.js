const { getChannelInfo } = require("yt-channel-info");

async function addurl(client, message, args, { server }) {
  if (!message.member.permissions.has("MANAGE_GUILD"))
    return message.reply("Você não tem a permissão **MANAGER_GUILD**!");
  
  const { Channel, Guild } = client.database;
  const { guild } = message;

  const url = (args[1] || "").replace(/<#[0-9]{0,18}>/g, "");
  const textChannel = message.mentions.channels.first();

  const channels = await Channel.find({});
  const channelIds = channels.map((channel) =>
    channel.serverId === guild.id ? channel.authorId : undefined
  );
  const error = (msg) => message.reply(msg);

  //~~~~~~~~~~~~~~~~~~~~CHECKING~~~~~~~~~~~~~~~~~~~~~~~~~//
  if (channelIds.length > 3) {
    return error("A quantidade máxima de canais é **3**!");
  } else if (!url.length) {
    return error("Você não passou a url do canal!");
  } else if (channelIds.includes(url.split("/").pop())) {
    return error("Esse canal já existe!");
  } else if (!textChannel) {
    return error("Você não disse qual era o canal de notificação!");
  } else if (textChannel.type !== "GUILD_TEXT") {
    return error("O canal selecionado deve ser de texto!");
  }

  let channel;
  try {
    const id = url.split("/").pop();
    const channelInfo = await getChannelInfo({ channelId: id });

    channel = channelInfo;
  } catch (e) {
    return error("O canal não foi encontrado!");
  }
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

  //~~~~~~~~~~~~~~~~~~CREATING WEBHOOK~~~~~~~~~~~~~~~~~~~//
  let webhookUrl = server.webhookUrl;

  if (!webhookUrl) {
    const searchWebhooks = await textChannel.fetchWebhooks();

    const webhook = searchWebhooks.find(
      (web) =>
        web.channelId === textChannel.id && web.name === client.user.username
    );

    if (webhook) webhookUrl = webhook.url;
    else {
      const bot = client.user;
      const newWebhook = await textChannel.createWebhook(bot.username, {
        avatar: bot.displayAvatarURL({ dynamic: true }),
      });
      webhookUrl = newWebhook.url;
    }
  }

  await Guild.findByIdAndUpdate(guild.id, {
    webhookUrl: webhookUrl,
  });
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//

  const record = {
    serverId: guild.id,
    webhookUrl: webhookUrl,
  };

  //~~~~~~~~~~~~~~REGISTERING THE CHANNEL~~~~~~~~~~~~~~~~//
  const channelDoc = await Channel.findById(channel.authorId);

  if (channelDoc) {
    channelDoc.servers.push(record);
    await Channel.findByIdAndUpdate(channel.authorId, {
      servers: channelDoc.servers,
    });
  } else {
    await Channel.create({
      _id: channel.authorId,
      servers: [record],
    });
  }

  message.reply("O canal foi registrado com sucesso!");
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~//
}

module.exports = addurl;
