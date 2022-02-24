const { MessageEmbed, MessageButton, MessageActionRow } = require("discord.js");
const math = require("mathjs");

exports.run = async (client, message, args) => {
  const limitTime = 60000;
  let value = "0";

  const keys = [
    "clear", "(", ")", "/",
    "7", "8", "9", "*",
    "4", "5", "6", "-",
    "1", "2", "3", "+",
    ".", "0", "00", "=",
  ];

  //--------------------BUTTONS & ROWS--------------------------//
  const buttons = new Array([], [], [], [], []);
  let current = 0;
  
  for (let i = 0; i < keys.length; i++) {
    if (buttons[current].length === 4) current++;
    let style;

    if (keys[i] === "clear") style = "DANGER";
    else if ("()/*-+)".includes(keys[i])) style = "PRIMARY";
    else if (keys[i] === "=") style = "SUCCESS";
    else style = "SECONDARY";

    const button = new MessageButton()
      .setCustomId(keys[i])
      .setLabel(keys[i])
      .setStyle(style);

    buttons[current].push(button);
  }

  const rows = [];
  for (let btns of buttons) {
    const row = new MessageActionRow().addComponents(btns);
    rows.push(row);
  }
  //-------------------------------------------------------//

  //--------------------EMBEDS--------------------------//
  const embed = new MessageEmbed()
    .setAuthor({ name: "Calculadora" })
    .setDescription("```0```")
    .setColor(process.env.colorEmbed);

  const msg = await message.reply({
    embeds: [embed],
    components: [...rows],
  });
  //-------------------------------------------------------//

  //--------------------COLLECTORS--------------------------//
  const collector = msg.createMessageComponentCollector({
    componentType: "BUTTON",
    time: limitTime,
  });

  collector.on("collect", async (i) => {
    if (i.user.id !== message.author.id) {
      return i.reply({
        content: "Só apenas quem executou o comando pode interagir com ele",
        ephemeral: true,
      });
    }

    await keyboard(i.customId, i);
  });

  collector.on("end", async () => {
    await msg
      .edit({
        embeds: [embed.setDescription("Tempo de Interação Acabado")],
        components: [],
      })
      .catch((o_O) => o_O);
  });
  //-------------------------------------------------------//

  //--------------------KEYBOARD--------------------------//
  async function keyboard(key) {
    if (key === "clear") value = "0";
    else if (!"clear=".includes(key)) {
      if ("0Cálculo Inválido!".includes(value)) value = key;
      else value += key;
    } else if (key === "=") {
      try {
        const res = math.evaluate(value);
        value = res;
      } catch (err) {
        value = "Cálculo Inválido!";
      }
    }

    await msg.edit({
      embeds: [embed.setDescription(`\`\`\`${value}\`\`\``)],
      components: [...rows],
    }).catch((o_0) => o_0);
  }
  //-------------------------------------------------------//
};

module.exports.help = {
  name: "calc",
  descriptio: "Execute uma calculadora",
  aliases: ["calculadora", "calcular"],
  usage: "calc",
};
