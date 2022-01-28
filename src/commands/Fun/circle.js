const { MessageEmbed, MessageAttachment } = require("discord.js");
const Canvas = require("canvas");
const getURL = require("../../utils/plugins/getURL");

exports.run = async (client, message, args) => {
  const url = await getURL(message, args);

  const image = await Canvas.loadImage(url);
  const canvas = await Canvas.createCanvas(image.width, image.height);
  const ctx = canvas.getContext("2d");
  ctx.drawImage(image, 0, 0);

  ctx.globalCompositeOperation = "destination-in";
  ctx.beginPath();
  ctx.arc(
    canvas.width / 2,
    canvas.height / 2,
    canvas.height / 2,
    0, Math.PI * 2, true
  );
  ctx.closePath();
  ctx.fill();

  const result = new MessageAttachment(canvas.toBuffer(), "circle.png");
  message.reply({ files: [result] });
};

module.exports.help = {
  name: "circle",
  description: "Faça um corte redondo em uma imagem",
  aliases: ["cortar"],
  usage: "circle <anexo|user|id|nome|url>",
  category: "Fun",
};
