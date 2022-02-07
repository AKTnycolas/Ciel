const { MessageAttachment } = require("discord.js");
const Canvas = require("canvas");
const getURL = require("../../utils/plugins/getURL");

exports.run = async (client, message, args) => {
  const url = await getURL(message, args);
  
  const image = await Canvas.loadImage(url);
  const canvas = await Canvas.createCanvas(image.width, image.height);
  const ctx = canvas.getContext("2d");

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(image, 0, 0, canvas.width / 4, canvas.height / 4);
  ctx.imageSmoothingEnabled = true;
  ctx.drawImage(
    canvas, 0, 0,
    canvas.width / 4,
    canvas.height / 4,
    0, 0,
    canvas.width + 5,
    canvas.height + 5
  );

  const result = new MessageAttachment(canvas.toBuffer(), "blur.png");
  message.reply({ files: [result] });
};

module.exports.help = {
  name: "blur",
  description: "Faça um imagem ficar borrada",
  aliases: ["borrar", "desfoque"],
  usage: "blur <anexo|user|id|nome|url>",
  category: "Fun",
};
