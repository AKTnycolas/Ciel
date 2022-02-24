const { notifier } = require("../../../utils/plugins/notifier");

module.exports = (client, node, error) => {
  console.error(error);
  error.stack = `NODE: ${node.identifier}\n` + error.stack;
  notifier(client, "Error No Vulkava", error);
};
