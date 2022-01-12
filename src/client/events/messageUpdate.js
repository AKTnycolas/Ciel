module.exports = (client, oldMessage, newMessage) => {
  client.emit("messageCreate", newMessage);
};
