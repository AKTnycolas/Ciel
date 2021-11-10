module.exports = {
  languages: {
    "en-US": "Inglês (Estados Unidos)",
    "en-GB": "Inglês (Grã-Bretanha)",
    "zh-CN": "Chinese (China)",
    "zh-TW": "Chinês (taiwan)",
    "cs": "Tcheco",
    "da": "Dinamarquês",
    "nl": "Holandês",
    "fr": "Francês",
    "de": "Alemão",
    "el": "Grego",
    "hu": "Húngaro",
    "it": "Italiano",
    "ja": "Japonês",
    "ko": "Coreano",
    "no": "Norueguês",
    "pl": "Polonês",
    "pt-BR": "Português (Brasil)",
    "ru": "Russo",
    "es-ES": "Espanhol (Espanha)",
    "sv-SE": "Sueco",
    "tr": "Turco",
    "bg": "Búlgaro",
    "uk": "Ucraniano",
    "fi": "Finlandês",
    "hr": "Croata",
    "ro": "Romena",
    "lt": "Lituano",
  },
  get: (language) => {
    if (typeof language !== "string") throw "the value entered must be a string";
    else return module.exports.languages[language];
  }
};
