const { Schema, model } = require("mongoose");

const schemaChannel = new Schema({
  _id: { type: String, required: true },
  servers: [{
    serverId: { type: String, required: true },
    webhookUrl: { type: String, required: true },
    message: { type: String, default: "Mais um vídeo no canal: {{link}}" },
  }],
});

const Channel = model("youtube_channels", schemaChannel);
module.exports = Channel;
