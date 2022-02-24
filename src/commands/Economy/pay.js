const { MessageButton, MessageActionRow } = require("discord.js");
const abrev = require("../../utils/plugins/abbrev");

exports.run = async (client, message, args, { user }) => {
  //-------------------BASE VARIABLES----------------------//
  const { User } = client.database;
  const sender =
    client.users.cache.get(args[0]) || message.mentions.users.first();
  const amount = parseInt(args[1]);
  //-------------------------------------------------------//

  //--------------------SOME CHECKS------------------------//
  if (!sender) {
    return message.reply("Você não disse para qual usuário enviar!");
  } else if (sender.id === message.author.id) {
    return message.reply("Você não pode enviar para você mesmo!");
  } else if (!amount) {
    return message.reply("Você não disse a quantidade!");
  } else if (amount < 50) {
    return message.reply("Você não pode enviar menos de **50** coins!");
  } else if (amount > user.balance.coins) {
    return message.reply("Você não tem todo esse dinheiro!");
  }
  //-------------------------------------------------------//

  const userData = await User.findById(sender.id);
  if (!userData)
    return message.reply("Esse usuário ainda não está na minha database");

  //--------------------------ROWS-----------------------//
  const row = new MessageActionRow().addComponents([
    new MessageButton().setCustomId("yes").setLabel("Sim").setStyle("SUCCESS"),
    new MessageButton().setCustomId("no").setLabel("Não").setStyle("DANGER"),
  ]);

  const msg = await message.reply({
    content: `Você tem certeza que quer enviar **${abrev(
      amount
    )}** coins para ${sender.tag}?`,
    components: [row],
  });
  //-------------------------------------------------------//

  //--------------------COLETORES--------------------------//
  const collector = msg.createMessageComponentCollector({
    componentType: "BUTTON",
    time: 60000,
  });

  collector.on("collect", async (i) => {
    if (i.user.id !== message.author.id) {
      return i.reply({
        content: "Só apenas quem executou o comando pode interagir com ele",
        ephemeral: true,
      });
    }

    if (i.customId === "yes") {
      // added money to sender
      await User.findByIdAndUpdate(sender.id, {
        "balance.coins": userData.balance.coins + amount,
      });

      // removing author money
      await User.findByIdAndUpdate(message.author.id, {
        "balance.coins": user.balance.coins - amount,
      });

      await msg.edit({
        content: "Transferência realizada com sucesso!",
        components: [],
      });
    } else {
      await msg.edit({
        content: "Ok, não foi enviado",
        components: [],
      });
    }
  });

  collector.on("end", async () => {
    await msg
      .edit({
        content: "Tempo de Interação Acabado",
        components: [],
      })
      .catch((o_O) => o_O);
  });
  //-------------------------------------------------------//
};

exports.help = {
  name: "pay",
  description: "Envie dinheiro para outro usuário",
  aliases: ["pagar"],
  usage: "pay [usuário] [quantidade]",
};
