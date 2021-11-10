const ms = require("moment");
const parse = require("parse-ms");
ms.locale("pt-br");

module.exports = {
  /**
   * this function only gives a prettier formatted on dates
   * @param {object} options - an object containing the formatting options
   * @returns {string} a string with the formatted date
   * @example
   * dateAndDay({ date: Date.now(), days: true });
   * // return the formatted date
   */
  dateAndDay(options) {
    options.format = options.format ? options.format : "DD/MM/YYYY HH:mm";
    let result = `${ms(options.date).format(options.format)}`;

    if (options.days)
      result = result.concat(` ( ${ms(options.date).startOf().fromNow()} )`);

    return result;
  },

  parseIn(date) {
    if (!date) throw new Error("date not found");

    // converting to milliseconds
    const milliseconds = parse(Date.now() - date.getTime());
    const { days, hours, minutes, seconds } = milliseconds;
    
    function format(timer, type) {
      if (timer <= 0) return "";
      return `${timer}${type} `;
    };
    
    const day = format(days, "d");
    const hour = format(hours, "h");
    const minute = format(minutes, "m");
    const second = format(seconds, "s");
    
    return `${day}${hour}${minute}${second}`;
  }
};