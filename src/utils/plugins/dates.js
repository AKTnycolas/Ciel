const parse = require("parse-ms");

module.exports = {
  parseIn(date) {
    if (!date) throw new Error("date not found!");

    // converting to milliseconds
    const milliseconds = parse(Date.now() - date.getTime());
    const { days, hours, minutes, seconds } = milliseconds;

    function format(timer, type) {
      if (timer <= 0) return "";
      return `${timer}${type} `;
    }

    const day = format(days, "d");
    const hour = format(hours, "h");
    const minute = format(minutes, "m");
    const second = format(seconds, "s");

    return `${day}${hour}${minute}${second}`;
  },
};
