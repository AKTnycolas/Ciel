module.exports = (number) => {
  number = number.toString();
  let text = "";

  const numbers = {
    0: "0️⃣",
    1: "1️⃣",
    2: "2️⃣",
    3: "3️⃣",
    4: "4️⃣",
    5: "5️⃣",
    6: "6️⃣",
    7: "7️⃣",
    8: "8️⃣",
    9: "9️⃣",
  };

  for (let i = 0; i < number.length; i++)
    text += "" + numbers[parseInt(number[i])] + "";
  return text;
};
