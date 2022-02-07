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
    imgData.data[i] =
      imgData.data[i] * 0.393 +
      imgData.data[i + 1] * 0.769 +
      imgData.data[i + 2] * 0.189;
    imgData.data[i + 1] =
      imgData.data[i] * 0.349 +
      imgData.data[i + 1] * 0.686 +
      imgData.data[i + 2] * 0.168;
    imgData.data[i + 2] =
      imgData.data[i] * 0.272 +
      imgData.data[i + 1] * 0.534 +
      imgData.data[i + 2] * 0.131;
  }

  ctx.putImageData(imgData, 0, 0);

  const result = new MessageAttachment(canvas.toBuffer(), "sepia.png");
  message.reply({ files: [result] });
};

module.exports.help = {
  name: "sepia",
  description: "Deixe uma imagem no tom de sépia",
  aliases: ["tomdemarrom"],
  usage: "sepia <anexo|user|id|nome|url>",
  category: "Fun",
};
