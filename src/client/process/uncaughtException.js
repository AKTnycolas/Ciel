const { notifier } = require("../../utils/plugins/notifier");

module.exports = async (client, reason) => {
  await notifier(client, "Error de Sintaxe", reason);
};
