module.exports = (client, node, code, reason) => {
  console.log(
    `[VULKAVA] - o node ${node.identifier} foi desconectado\nMotivo: ${reason}`
  );
};
