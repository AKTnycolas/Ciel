module.exports = (client) => {
  client.users.findByName = (name) => {
    if (!name) return undefined;

    const user = client.users.cache.find((u) =>
      u.username.toLowerCase().includes(name.toLowerCase())
    );

    return user;
  };
};
