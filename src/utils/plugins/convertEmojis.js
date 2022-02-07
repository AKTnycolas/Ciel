const Emojis = require("../../utils/emojis");

module.exports = (string) => {
  string = string.toString().toLowerCase().split("");
  let text = "";

  for (const letter of string) {
    if (letter !== " ") text += letter.replace(letter, Emojis[letter] ?? "");
  }

  return text;
};
