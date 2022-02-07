const { MessageAttachment } = require("discord.js");
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
    const brightness =
      0.34 * imgData.data[i] +
      0.5 * imgData.data[i + 1] +
      0.16 * imgData.data[i + 2];
    imgData.data[i] = brightness;
    imgData.data[i + 1] = brightness;
    imgData.data[i + 2] = brightness;
  }

  ctx.putImageData(imgData, 0, 0);

  const result = new MessageAttachment(canvas.toBuffer(), "greyscale.png");
  message.reply({ files: [result] });
};

module.exports.help = {
  name: "greyscale",
  description: "Faça uma imagem ficar em tom de cinza",
  aliases: ["escaladecinza"],
  usage: "greyscale <anexo|user|id|nome|url>",
  category: "Fun",
};
