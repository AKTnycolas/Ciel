const { MessageEmbed, MessageAttachment } = require("discord.js");
const Canvas = require("canvas");
const getURL = require("../../utils/plugins/getURL");

exports.run = async (client, message, args) => {
  const url = await getURL(message, args);

  const image = await Canvas.loadImage(url);
  const canvas = await Canvas.createCanvas(image.width, image.height);
  const ctx = canvas.getContext("2d");
  ctx.drawImage(image, 0, 0);

  const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < imgData.data.length; i += 4) {
    imgData.data[i] -= 100;
    imgData.data[i + 1] -= 100;
    imgData.data[i + 2] -= 100;
  }

  ctx.putImageData(imgData, 0, 0);

  const result = new MessageAttachment(canvas.toBuffer(), "invert.png");
  message.reply({ files: [result] });
};

module.exports.help = {
  name: "darkness",
  description: "Escureça uma imagem",
  aliases: ["escurecer"],
  usage: "darkness <anexo|user|id|nome|url>",
  category: "Fun",
};
