const { MessageAttachment } = require("discord.js");
const Canvas = require("canvas");
const getURL = require("../../utils/plugins/getURL");

exports.run = async (client, message, args) => {
  const url = await getURL(message, args);

  const image = await Canvas.loadImage(url);
  const canvas = await Canvas.createCanvas(image.width, image.height);
  const ctx = canvas.getContext("2d");
  ctx.drawImage(image, 0, 0);

  const pixel = 5 / 100;
  ctx.drawImage(image, 0, 0, canvas.width * pixel, canvas.height * pixel);
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(
    canvas, 0, 0,
    canvas.width * pixel,
    canvas.height * pixel,
    0, 0,
    canvas.width + 5,
    canvas.height + 5
  );

  const result = new MessageAttachment(canvas.toBuffer(), "pixelate.png");
  message.reply({ files: [result] });
};

module.exports.help = {
  name: "pixelate",
  description: "Faça uma imagem ficar pixelada",
  aliases: ["pixel", "pixels"],
  usage: "pixelate <anexo|user|id|nome|url>",
};
