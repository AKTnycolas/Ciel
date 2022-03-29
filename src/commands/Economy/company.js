/* eslint-disable max-len */

const { MessageEmbed } = require("discord.js");
const { getter } = require("../../utils/emojis.js");
const { stripIndents } = require("common-tags");

exports.run = async (client, message, args, { user }) => {
  //-------------------BASE VARIABLES----------------------//
  const { User } = client.database;
  const Emojis = new getter(client);
  //-------------------------------------------------------//

  //-------------------SUB COMMANDS------------------------//
  const sub = client.subCommands.get("Company").get(args[0]);

  if (sub) {
    return sub(client, message, args, { user });
  }
  //-------------------------------------------------------//

  //----------------CHECKS AND VARIABLES-------------------//
  const author = message.mentions.users.first() || message.author;
  const authorDoc = await User.findById(author.id).populate("company");
  const who = author.id === message.author.id ? "Você" : "Esse usuário";

  if (!authorDoc) return message.reply(`${who} não está na minha database`);

  const company = authorDoc.company;
  if (!company) return message.reply(`${who} não participa de uma empresa!`);
  //-------------------------------------------------------//

  //------------------EMBED VARIABLES----------------------//
  const name = company.name === "null" ? "Não definido" : company.name;
  const owner = client.users.cache.get(company.owner);
  const employees = !company.employees ? 0 : company.employees.length;

  const level = stripIndents`\`\`\`js
  Level: ${company.level}
  Xp: ${company.xp}
  NextLevel: ${company.nextLevel}
  \`\`\``;
  const description = stripIndents`\`\`\`
  ${company.description === "null" ? "Não definido" : company.description}
  \`\`\`
  `;
  //-------------------------------------------------------//

  //------------------------EMBED--------------------------//
  const embed = new MessageEmbed()
    .setAuthor({
      name: "Status Da Empresa",
      iconURL: Emojis.get("company").url,
    })
    .setThumbnail(Emojis.get("company").url)
    .addField(`${Emojis.get("coroa")} Dono Da Empresa: `, owner.tag)
    .addField(`${Emojis.get("company")} Nome Da Empresa: `, name)
    .addField(`${Emojis.get("description")} Descrição: `, description)
    .addField(`${Emojis.get("wallet")} Salário: `, company.wage.toString())
    .addField(`${Emojis.get("level")} Level: `, level)
    .addField(`${Emojis.get("employees")} Funcionários: `, employees + " funcionários")
    .setColor(process.env.colorEmbed);
  //-------------------------------------------------------//

  return message.reply({
    embeds: [embed],
  });
};

exports.help = {
  name: "company",
  description: "Veja as informações de uma empresa",
  aliases: ["companies", "factory"],
  usage: "company ",
  isSub: true,
  ref: "Company",
};
