const { MessageButton, MessageActionRow } = require("discord.js");
const { notifier } = require("../../../utils/plugins/notifier");

async function invite(client, message, args, { user: authorDoc }) {
  try {
    const { User, Company } = client.database;
    authorDoc = await authorDoc.populate("company");
    
    if (!authorDoc.company)
      return message.reply("Você não pertence a nenhuma empresa!");

    const user =
      client.users.cache.get(args[1]) || message.mentions.users.first();
    if (!user || user.id === message.author.id)
      return message.reply("Você não mencionou o usuário!");

    const userDoc = await User.findById(user.id).populate("company");

    if (!userDoc)
      return message.reply("Esse usuário ainda não está na minha database!");
    else if (userDoc.company)
      return message.reply("Esse usuário já trabalha em outra empresa!");

    //--------------------------ROWS-----------------------//
    const row = new MessageActionRow().addComponents([
      new MessageButton()
        .setCustomId("COMPANY_YES")
        .setLabel("Aceitar")
        .setStyle("SUCCESS"),
      new MessageButton()
        .setCustomId("COMPANY_NO")
        .setLabel("Rejeitar")
        .setStyle("DANGER"),
    ]);

    const msg = await message.reply({
      content: `<@${user.id}> Você foi convidado por <@${
        authorDoc._id
      }> para entrar na empresa`,
      components: [row],
    });
    //-------------------------------------------------------//

    //--------------------COLETORES--------------------------//
    const collector = msg.createMessageComponentCollector({
      componentType: "BUTTON",
      time: 60000,
    });

    collector.on("collect", async (i) => {
      if (i.user.id !== userDoc._id) {
        return i.reply({
          content: "Só apenas quem executou o comando pode interagir com ele",
          ephemeral: true,
        });
      }
      

      if (i.customId === "COMPANY_YES") {
        const upCompany = await Company.findById(authorDoc.company._id);
        
        if (upCompany.employees.length === 15)
          return message.reply("A empresa já está cheia");
        
        await User.findByIdAndUpdate(user.id, {
          company: upCompany._id,
        });

        await Company.findByIdAndUpdate(upCompany._id, {
          $push: { employees: user.id },
        });

        await msg.edit({
          content: "Convite aceito com sucesso!",
          components: [],
        });
      } else if (i.customId === "COMPANY_NO") {
        await msg.edit({
          content: "Convite rejeitado com sucesso!",
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

module.exports = invite;
