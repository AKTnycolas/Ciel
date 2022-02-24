const { MessageAttachment } = require("discord.js");
const Canvas = require("canvas");
const GIFEncoder = require("gifencoder");
const getURL = require("../../utils/plugins/getURL");

exports.run = async (client, message, args) => {
  const url = await getURL(message, args);
  
  const base = await Canvas.loadImage("https://imgur.com/AtwEgk7.png");
  const img = await Canvas.loadImage(url);
  const gif = new GIFEncoder(256, 310);
  
  const br = 30;
  const lr = 20;
  
  gif.start();
  gif.setRepeat(0);
  gif.setDelay(15);
  
  const canvas = Canvas.createCanvas(256, 310);
  const ctx = canvas.getContext("2d");
  
  let i = 0;
  while (i < 9) {
    ctx.clearRect(0, 0, 256, 310);
    ctx.drawImage(
      img,
      Math.floor(Math.random() * br) - br,
      Math.floor(Math.random() * lr) - lr,
      256 + br,
      310 - 54 + br
    );
    
    ctx.fillStyle = "#FF000033";
    ctx.fillRect(0, 0, 256, 310);
    ctx.drawImage(
      base,
      Math.floor(Math.random() * lr) - lr,
      310 - 54 + Math.floor(Math.random() * lr) - lr,
      256 + lr,
      54 + lr
    );
    
    gif.addFrame(ctx);
    i++;
  }
  
  gif.finish();

  const result = new MessageAttachment(gif.out.getData(), "trigger.gif");
  message.reply({ files: [result] });
};

module.exports.help = {
  name: "triggered",
  description: "triggered",
  aliases: ["trigger"],
  usage: "triggered <anexo|user|id|nome|url>",
};
