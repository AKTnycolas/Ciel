async function getURL(message, args) {
  const { client, mentions, attachments } = message;

  if (attachments.first()) {
    return attachments.first().url;
  }

  if (mentions.users.first()) {
    const user = mentions.users.first();
    return user.displayAvatarURL({
      dynamic: false,
      format: "png",
      size: 2048
    });
  }

  if (client.users.cache.get(args[0])) {
    const user = client.users.cache.get(args[0]);
    return user.displayAvatarURL({
      dynamic: false,
      format: "png",
      size: 2048
    });
  }

  if (client.users.findByName(args[0])) {
    const user = client.users.findByName(args[0]);
    return user.displayAvatarURL({
      dynamic: false,
      format: "png",
      size: 2048
    });
  }

  if (checkLink(args[0])) {
    return args[0];
  }

  return message.author.displayAvatarURL({
    dynamic: false,
    format: "png",
    size: 2048,
  });

  function checkLink(link) {
    const reg =
      /^(https?:\/\/)((([-a-z0-9]{1,})?(-?)+[-a-z0-9]{1,})(\.))+([a-z]{1,63})\/((([a-z0-9._\-~#%])+\/)+)?([a-z0-9._\-~#%]+)\.(jpg|jpeg|gif|png|bmp)$/i;
    return reg.test(link);
  }
}

module.exports = getURL;
