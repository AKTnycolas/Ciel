const { MessageButton, MessageActionRow } = require("discord.js");
const { notifier } = require("../../../utils/plugins/notifier");

async function leave(client, message, args, { user: authorDoc }) {
  try {
    const { User, Company } = client.database;
    authorDoc = await authorDoc.populate("company");
    const company = authorDoc.company;
    
    if (!company) 
      return message.reply("Você não participa de uma empresa!");
    
    if (authorDoc._id === company.owner)
      return message.reply(
        "Você não pode sair, pois você é o único dono existente!"
      );

    //--------------------------ROWS-----------------------//
    const row = new MessageActionRow().addComponents([
      new MessageButton()
        .setCustomId("COMPANY_YES")
        .setLabel("Sim")
        .setStyle("SUCCESS"),
      new MessageButton()
        .setCustomId("COMPANY_NO")
        .setLabel("Não")
        .setStyle("DANGER"),
    ]);

    const msg = await message.reply({
      content: "Você tem certeza que você que sair da empresa?",
      components: [row],
    });
    //-------------------------------------------------------//

    //--------------------COLETORES--------------------------//
    const collector = msg.createMessageComponentCollector({
      componentType: "BUTTON",
      time: 60000,
    });

    collector.on("collect", async (i) => {
      if (i.user.id !== authorDoc._id) {
        return i.reply({
          content: "Só apenas quem executou o comando pode interagir com ele",
          ephemeral: true,
        });
      }

      if (i.customId === "COMPANY_YES") {
        await User.findByIdAndUpdate(authorDoc._id, {
          $unset: { company: "" },
        });

        await Company.findByIdAndUpdate(company._id, {
          $pull: { employees: { $in: [authorDoc._id] } },
        });

        await msg.edit({
          content: "Você saiu com sucesso!",
          components: [],
        });
      } else if (i.customId === "COMPANY_NO") {
        await msg.edit({
          content: "Cancelado com sucesso!",
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
  } catch (err) {
    notifier(client, "Comando Com Error", err);
    message.reply("Aconteceu algum error ao tentar usar o comando");
  }
}

module.exports = leave;
