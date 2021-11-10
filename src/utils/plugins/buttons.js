const { MessageButton, MessageActionRow } = require("discord.js");
const Emojis = require("../emojis");

module.exports = {
  serverinfo() {
    const buttonNext = new MessageButton()
    .setCustomId("nextFromServerinfo")
    .setEmoji(Emojis.next)
    .setStyle("PRIMARY");
    
    const buttonBack = new MessageButton()
    .setCustomId("backFromServerinfo")
    .setEmoji(Emojis.back)
    .setStyle("PRIMARY");
    
    const rowNext = new MessageActionRow().addComponents([
      buttonNext.setDisabled(false),
      buttonBack.setDisabled(true)
    ]);

    const rowBack = new MessageActionRow().addComponents([
      buttonNext.setDisabled(true),
      buttonBack.setDisabled(false)
    ]);

    return { rowNext, rowBack };
  },
  
  
  userinfo() {
    const buttonNext = new MessageButton()
    .setCustomId("nextFromUserinfo")
    .setEmoji(Emojis.next)
    .setStyle("PRIMARY");
    
    const buttonBack = new MessageButton()
    .setCustomId("backFromUserinfo")
    .setEmoji(Emojis.back)
    .setStyle("PRIMARY");
    
    const rowNext = new MessageActionRow().addComponents([
      buttonNext.setDisabled(false),
      buttonBack.setDisabled(true)
    ]);
    
    const rowBack = new MessageActionRow().addComponents([
      buttonNext.setDisabled(true),
      buttonBack.setDisabled(false)
    ]);
    
    return { rowNext, rowBack };
  },
  
  
  invites(client) {
    const invite = `https://discord.com/oauth2/authorize?client_id=${client.user.id}&scope=bot&permissions=8`;
    const suport = "https://discord.gg/V9NQbXWqUs";
    
    const buttonInvite = new MessageButton()
      .setURL(invite)
      .setLabel("Me Adicione No Seu Servidor")
      .setEmoji(Emojis.linkInvite)
      .setStyle("LINK");

    const buttonSuport = new MessageButton()
      .setURL(suport)
      .setLabel("Servidor De Suporte")
      .setEmoji(Emojis.PARTNERED_SERVER_OWNER)
      .setStyle("LINK");
    
    return new MessageActionRow().addComponents([
      buttonInvite,
      buttonSuport
    ]);
  }
};