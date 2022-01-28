const { MessageEmbed, MessageAttachment } = require("discord.js");
const Canvas = require("canvas");

exports.run = async (client, message, args) => {
  const canvas = await Canvas.createCanvas(1024, 1024);
  const ctx = canvas.getContext("2d");
  
  const GRIDSIZE = 25;
  const JITTER = 0.5;
  let points = [];
  
  for (let x = 0; x <= GRIDSIZE; x++) {
    for (let y = 0; y <= GRIDSIZE; y++) {
      points.push({
        x: x + JITTER * (Math.random() - Math.random()),
        y: y + JITTER * (Math.random() - Math.random()),
      });
    }
  }

  function drawPoints(canvas, points) {
    ctx.save();
    ctx.scale(canvas.width / GRIDSIZE, canvas.height / GRIDSIZE);
    ctx.fillStyle = "hsl(0, 50%, 50%)";
    for (let { x, y } of points) {
      ctx.beginPath();
      ctx.arc(x, y, 0.1, 0, 2 * Math.PI);
      ctx.fill();
    }
    ctx.restore();
  }

  await drawPoints(canvas, points);
  
  const attachment = new MessageAttachment(canvas.toBuffer(), "hi.png");
  message.reply({
    content: "9",
    files: [attachment]
  });
};

exports.help = {
  name: "test",
  description: "test",
  aliases: [],
  usage: "test",
  category: "Owner",
};
