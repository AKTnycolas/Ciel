class getter {
  constructor(client) {
    this.client = client;
  }
  get(name) {
    const id = module.exports[name];
    if (!id) throw new Error(`O emoji ${name} não foi encontrado`);
    else return this.client.emojis.cache.get(id);
  }
}

module.exports = {
  // getter
  getter,

  // emojis
  loading: "910922731527208970",
  next: "910922776930549772",
  back: "910922770932707400",
  statistics: "940193735868825621",
  levelUp: "955761369364430879",
  rimuru: "955897674140385303",
  level: "957452034863419432",
  
  // Config
  "youtube": "977071147361374238",
  "bin": "977398552097615872",
  "ytnotif": "977938266252783646",

  // Economy
  wallet: "941138646373912597",
  employees: "957451144660135977",
  
  // companies
  company: "957198444638920725",

  // manu
  update_system: "909904062743474187",

  edited: "910922737508298782",
  yes: "910922889891557407",
  no: "910922883520397333",
  settingsId: "910922877363159132",
  channel: "910923008875593738",
  medal: "910923022599323719",
  right: "954308325082824726",
  wrong: "954308301368197150",

  // botinfo
  programmer: "910922811541975041",
  users: "910922901786619945",
  servers: "910922907708956722",
  cpu: "910922913400623154",
  ram: "910922920073785395",
  versions: "909905190432419911",
  nodejs: "910922788758519838",
  discord_theme_1: "911448778744148019",
  discord_theme_2: "911448711605911612",
  mongoDB: "910922783167504465",
  heart_mine: "910922755011133461",
  suport: "910922937022967888",

  // play
  playlist: "944306172230508554",
  music: "944306188789641256",

  // help command
  home: "966331568425689138",
  Config: "908549050519941171",
  Music: "944306188789641256",
  Owner: "910035786643144704",
  Moderation: "910048649462042664",
  Economy: "940977801580924928",
  Information: "910922942790119466",
  Fun: "931015851405090846",
  Utils: "910922948213366784",
  
  coroa: "910922953720492034",
  description: "930775457601843220",

  // serverinfo
  name: "910922959651217509",
  world: "910922965435154512",
  shield: "910922977133076491",
  boost: "904835204307361822",
  online: "910923002596716595",
  full_heart: "902892025307889664",

  // userinfo
  reference: "910923016773435392",
  person_programming: "909888620008181800",
  medal: "910327561932910600",

  // github
  following: "931970991071043694",
  followers: "931970970967760987",
  repos: "931972735675007006",

  // reload
  refresh: "910937826596647042",

  // notifier
  bug: "911991971717980202",
  pag: "912005931179597854",
  wrong_theme_2: "912009031256772659",

  // welcome
  channel: "910923008875593738",
  info_azul: "855616855476535327",

  // messageDelete
  trash: "939123051054899220",

  // discord badges
  DISCORD_EMPLOYEE: "910922866227294228",
  TEAM_USER: "910922866227294228",
  PARTNERED_SERVER_OWNER: "910922817648873553",
  DISCORD_CERTIFIED_MODERATOR: "910922836141543475",
  EARLY_VERIFIED_BOT_DEVELOPER: "910922811541975041",
  BUGHUNTER_LEVEL_1: "910922848401489970",
  BUGHUNTER_LEVEL_2: "910922841719963718",
  HOUSE_BRILLIANCE: "910922799537848371",
  HOUSE_BRAVERY: "910922794315956285",
  DISCOR_BOOST: "910922829241929801",
  HOUSE_BALANCE: "910922805636395009",
  HYPESQUAD_EVENTS: "910922854181253131",
  EARLY_SUPPORTER: "910922860179103764",
  VERIFIED_BOT: "910922872132890675",
  VERIFIED_BOT_ID: "905019666584449055",
  DISCORD_PARTNER_ID: "904835160216858674",

  a: ":regional_indicator_a:",
  b: ":regional_indicator_b:",
  c: ":regional_indicator_c:",
  d: ":regional_indicator_d:",
  e: ":regional_indicator_e:",
  f: ":regional_indicator_f:",
  g: ":regional_indicator_g:",
  h: ":regional_indicator_h:",
  i: ":regional_indicator_i:",
  j: ":regional_indicator_j:",
  k: ":regional_indicator_k:",
  l: ":regional_indicator_l:",
  m: ":regional_indicator_m:",
  n: ":regional_indicator_n:",
  o: ":regional_indicator_o:",
  p: ":regional_indicator_p:",
  q: ":regional_indicator_q:",
  r: ":regional_indicator_r:",
  s: ":regional_indicator_s:",
  t: ":regional_indicator_t:",
  u: ":regional_indicator_u:",
  v: ":regional_indicator_v:",
  w: ":regional_indicator_w:",
  x: ":regional_indicator_x:",
  y: ":regional_indicator_y:",
  z: ":regional_indicator_z:",

  0: ":zero:",
  1: ":one:",
  2: ":two:",
  3: ":three:",
  4: ":four:",
  5: ":five:",
  6: ":six:",
  7: ":seven:",
  8: ":eight:",
  9: ":nine:",
};
