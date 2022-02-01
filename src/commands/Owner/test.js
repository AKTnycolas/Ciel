const { MessageAttachment } = require("discord.js");
const Canvas = require("canvas");
// tests for a map generator
exports.run = async (client, message) => {
  const canvas = await Canvas.createCanvas(1024, 1024);
  const ctx = canvas.getContext("2d");

  const GRIDSIZE = 25;
  const JITTER = 0.5;
  const points = [];

  for (let x = 0; x <= GRIDSIZE; x++) {
    for (let y = 0; y <= GRIDSIZE; y++) {
      points.push({
        x: x + JITTER * (Math.random() - Math.random()),
        y: y + JITTER * (Math.random() - Math.random()),
      });
    }
  }

  ctx.save();
  ctx.scale(canvas.width / GRIDSIZE, canvas.height / GRIDSIZE);
  ctx.fillStyle = "#C24243";
  for (const { x, y } of points) {
    ctx.beginPath();
    ctx.arc(x, y, 0.1, 0, 2 * Math.PI);
    ctx.fill();
  }
  ctx.restore();

  const attachment = new MessageAttachment(canvas.toBuffer(), "map.png");
  message.reply({
    files: [attachment],
  });
};

exports.help = {
  name: "test",
  description: "test",
  aliases: [],
  usage: "test",
  category: "Owner",
};
