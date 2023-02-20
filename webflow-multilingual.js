(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.wm = {}));
})(this, (function (exports) { 'use strict';

  const LANGUAGES_LIST = {
    aa: {
      name: 'Afar',
      nativeName: 'Afaraf'
    },
    ab: {
      name: 'Abkhaz',
      nativeName: 'аҧсуа бызшәа'
    },
    ae: {
      name: 'Avestan',
      nativeName: 'avesta'
    },
    af: {
      name: 'Afrikaans',
      nativeName: 'Afrikaans'
    },
    ak: {
      name: 'Akan',
      nativeName: 'Akan'
    },
    am: {
      name: 'Amharic',
      nativeName: 'አማርኛ'
    },
    an: {
      name: 'Aragonese',
      nativeName: 'aragonés'
    },
    ar: {
      name: 'Arabic',
      nativeName: 'اَلْعَرَبِيَّةُ'
    },
    as: {
      name: 'Assamese',
      nativeName: 'অসমীয়া'
    },
    av: {
      name: 'Avaric',
      nativeName: 'авар мацӀ'
    },
    ay: {
      name: 'Aymara',
      nativeName: 'aymar aru'
    },
    az: {
      name: 'Azerbaijani',
      nativeName: 'azərbaycan dili'
    },
    ba: {
      name: 'Bashkir',
      nativeName: 'башҡорт теле'
    },
    be: {
      name: 'Belarusian',
      nativeName: 'беларуская мова'
    },
    bg: {
      name: 'Bulgarian',
      nativeName: 'български език'
    },
    bi: {
      name: 'Bislama',
      nativeName: 'Bislama'
    },
    bm: {
      name: 'Bambara',
      nativeName: 'bamanankan'
    },
    bn: {
      name: 'Bengali',
      nativeName: 'বাংলা'
    },
    bo: {
      name: 'Tibetan',
      nativeName: 'བོད་ཡིག'
    },
    br: {
      name: 'Breton',
      nativeName: 'brezhoneg'
    },
    bs: {
      name: 'Bosnian',
      nativeName: 'bosanski jezik'
    },
    ca: {
      name: 'Catalan',
      nativeName: 'Català'
    },
    ce: {
      name: 'Chechen',
      nativeName: 'нохчийн мотт'
    },
    ch: {
      name: 'Chamorro',
      nativeName: 'Chamoru'
    },
    co: {
      name: 'Corsican',
      nativeName: 'corsu'
    },
    cr: {
      name: 'Cree',
      nativeName: 'ᓀᐦᐃᔭᐍᐏᐣ'
    },
    cs: {
      name: 'Czech',
      nativeName: 'čeština'
    },
    cu: {
      name: 'Old Church Slavonic',
      nativeName: 'ѩзыкъ словѣньскъ'
    },
    cv: {
      name: 'Chuvash',
      nativeName: 'чӑваш чӗлхи'
    },
    cy: {
      name: 'Welsh',
      nativeName: 'Cymraeg'
    },
    da: {
      name: 'Danish',
      nativeName: 'dansk'
    },
    de: {
      name: 'German',
      nativeName: 'Deutsch'
    },
    dv: {
      name: 'Divehi',
      nativeName: 'ދިވެހި'
    },
    dz: {
      name: 'Dzongkha',
      nativeName: 'རྫོང་ཁ'
    },
    ee: {
      name: 'Ewe',
      nativeName: 'Eʋegbe'
    },
    el: {
      name: 'Greek',
      nativeName: 'Ελληνικά'
    },
    en: {
      name: 'English',
      nativeName: 'English'
    },
    eo: {
      name: 'Esperanto',
      nativeName: 'Esperanto'
    },
    es: {
      name: 'Spanish',
      nativeName: 'Español'
    },
    et: {
      name: 'Estonian',
      nativeName: 'eesti'
    },
    eu: {
      name: 'Basque',
      nativeName: 'euskara'
    },
    fa: {
      name: 'Persian',
      nativeName: 'فارسی'
    },
    ff: {
      name: 'Fula',
      nativeName: 'Fulfulde'
    },
    fi: {
      name: 'Finnish',
      nativeName: 'suomi'
    },
    fj: {
      name: 'Fijian',
      nativeName: 'vosa Vakaviti'
    },
    fo: {
      name: 'Faroese',
      nativeName: 'føroyskt'
    },
    fr: {
      name: 'French',
      nativeName: 'Français'
    },
    fy: {
      name: 'Western Frisian',
      nativeName: 'Frysk'
    },
    ga: {
      name: 'Irish',
      nativeName: 'Gaeilge'
    },
    gd: {
      name: 'Scottish Gaelic',
      nativeName: 'Gàidhlig'
    },
    gl: {
      name: 'Galician',
      nativeName: 'galego'
    },
    gn: {
      name: 'Guaraní',
      nativeName: "Avañe'ẽ"
    },
    gu: {
      name: 'Gujarati',
      nativeName: 'ગુજરાતી'
    },
    gv: {
      name: 'Manx',
      nativeName: 'Gaelg'
    },
    ha: {
      name: 'Hausa',
      nativeName: 'هَوُسَ'
    },
    he: {
      name: 'Hebrew',
      nativeName: 'עברית'
    },
    hi: {
      name: 'Hindi',
      nativeName: 'हिन्दी'
    },
    ho: {
      name: 'Hiri Motu',
      nativeName: 'Hiri Motu'
    },
    hr: {
      name: 'Croatian',
      nativeName: 'Hrvatski'
    },
    ht: {
      name: 'Haitian',
      nativeName: 'Kreyòl ayisyen'
    },
    hu: {
      name: 'Hungarian',
      nativeName: 'magyar'
    },
    hy: {
      name: 'Armenian',
      nativeName: 'Հայերեն'
    },
    hz: {
      name: 'Herero',
      nativeName: 'Otjiherero'
    },
    ia: {
      name: 'Interlingua',
      nativeName: 'Interlingua'
    },
    id: {
      name: 'Indonesian',
      nativeName: 'Bahasa Indonesia'
    },
    ie: {
      name: 'Interlingue',
      nativeName: 'Interlingue'
    },
    ig: {
      name: 'Igbo',
      nativeName: 'Asụsụ Igbo'
    },
    ii: {
      name: 'Nuosu',
      nativeName: 'ꆈꌠ꒿ Nuosuhxop'
    },
    ik: {
      name: 'Inupiaq',
      nativeName: 'Iñupiaq'
    },
    io: {
      name: 'Ido',
      nativeName: 'Ido'
    },
    is: {
      name: 'Icelandic',
      nativeName: 'Íslenska'
    },
    it: {
      name: 'Italian',
      nativeName: 'Italiano'
    },
    iu: {
      name: 'Inuktitut',
      nativeName: 'ᐃᓄᒃᑎᑐᑦ'
    },
    ja: {
      name: 'Japanese',
      nativeName: '日本語'
    },
    jv: {
      name: 'Javanese',
      nativeName: 'basa Jawa'
    },
    ka: {
      name: 'Georgian',
      nativeName: 'ქართული'
    },
    kg: {
      name: 'Kongo',
      nativeName: 'Kikongo'
    },
    ki: {
      name: 'Kikuyu',
      nativeName: 'Gĩkũyũ'
    },
    kj: {
      name: 'Kwanyama',
      nativeName: 'Kuanyama'
    },
    kk: {
      name: 'Kazakh',
      nativeName: 'қазақ тілі'
    },
    kl: {
      name: 'Kalaallisut',
      nativeName: 'kalaallisut'
    },
    km: {
      name: 'Khmer',
      nativeName: 'ខេមរភាសា'
    },
    kn: {
      name: 'Kannada',
      nativeName: 'ಕನ್ನಡ'
    },
    ko: {
      name: 'Korean',
      nativeName: '한국어'
    },
    kr: {
      name: 'Kanuri',
      nativeName: 'Kanuri'
    },
    ks: {
      name: 'Kashmiri',
      nativeName: 'कश्मीरी'
    },
    ku: {
      name: 'Kurdish',
      nativeName: 'Kurdî'
    },
    kv: {
      name: 'Komi',
      nativeName: 'коми кыв'
    },
    kw: {
      name: 'Cornish',
      nativeName: 'Kernewek'
    },
    ky: {
      name: 'Kyrgyz',
      nativeName: 'Кыргызча'
    },
    la: {
      name: 'Latin',
      nativeName: 'latine'
    },
    lb: {
      name: 'Luxembourgish',
      nativeName: 'Lëtzebuergesch'
    },
    lg: {
      name: 'Ganda',
      nativeName: 'Luganda'
    },
    li: {
      name: 'Limburgish',
      nativeName: 'Limburgs'
    },
    ln: {
      name: 'Lingala',
      nativeName: 'Lingála'
    },
    lo: {
      name: 'Lao',
      nativeName: 'ພາສາລາວ'
    },
    lt: {
      name: 'Lithuanian',
      nativeName: 'lietuvių kalba'
    },
    lu: {
      name: 'Luba-Katanga',
      nativeName: 'Kiluba'
    },
    lv: {
      name: 'Latvian',
      nativeName: 'latviešu valoda'
    },
    mg: {
      name: 'Malagasy',
      nativeName: 'fiteny malagasy'
    },
    mh: {
      name: 'Marshallese',
      nativeName: 'Kajin M̧ajeļ'
    },
    mi: {
      name: 'Māori',
      nativeName: 'te reo Māori'
    },
    mk: {
      name: 'Macedonian',
      nativeName: 'македонски јазик'
    },
    ml: {
      name: 'Malayalam',
      nativeName: 'മലയാളം'
    },
    mn: {
      name: 'Mongolian',
      nativeName: 'Монгол хэл'
    },
    mr: {
      name: 'Marathi',
      nativeName: 'मराठी'
    },
    ms: {
      name: 'Malay',
      nativeName: 'Bahasa Melayu'
    },
    mt: {
      name: 'Maltese',
      nativeName: 'Malti'
    },
    my: {
      name: 'Burmese',
      nativeName: 'ဗမာစာ'
    },
    na: {
      name: 'Nauru',
      nativeName: 'Dorerin Naoero'
    },
    nb: {
      name: 'Norwegian Bokmål',
      nativeName: 'Norsk bokmål'
    },
    nd: {
      name: 'Northern Ndebele',
      nativeName: 'isiNdebele'
    },
    ne: {
      name: 'Nepali',
      nativeName: 'नेपाली'
    },
    ng: {
      name: 'Ndonga',
      nativeName: 'Owambo'
    },
    nl: {
      name: 'Dutch',
      nativeName: 'Nederlands'
    },
    nn: {
      name: 'Norwegian Nynorsk',
      nativeName: 'Norsk nynorsk'
    },
    no: {
      name: 'Norwegian',
      nativeName: 'Norsk'
    },
    nr: {
      name: 'Southern Ndebele',
      nativeName: 'isiNdebele'
    },
    nv: {
      name: 'Navajo',
      nativeName: 'Diné bizaad'
    },
    ny: {
      name: 'Chichewa',
      nativeName: 'chiCheŵa'
    },
    oc: {
      name: 'Occitan',
      nativeName: 'occitan'
    },
    oj: {
      name: 'Ojibwe',
      nativeName: 'ᐊᓂᔑᓈᐯᒧᐎᓐ'
    },
    om: {
      name: 'Oromo',
      nativeName: 'Afaan Oromoo'
    },
    or: {
      name: 'Oriya',
      nativeName: 'ଓଡ଼ିଆ'
    },
    os: {
      name: 'Ossetian',
      nativeName: 'ирон æвзаг'
    },
    pa: {
      name: 'Panjabi',
      nativeName: 'ਪੰਜਾਬੀ'
    },
    pi: {
      name: 'Pāli',
      nativeName: 'पाऴि'
    },
    pl: {
      name: 'Polish',
      nativeName: 'Polski'
    },
    ps: {
      name: 'Pashto',
      nativeName: 'پښتو'
    },
    pt: {
      name: 'Portuguese',
      nativeName: 'Português'
    },
    qu: {
      name: 'Quechua',
      nativeName: 'Runa Simi'
    },
    rm: {
      name: 'Romansh',
      nativeName: 'rumantsch grischun'
    },
    rn: {
      name: 'Kirundi',
      nativeName: 'Ikirundi'
    },
    ro: {
      name: 'Romanian',
      nativeName: 'Română'
    },
    ru: {
      name: 'Russian',
      nativeName: 'Русский'
    },
    rw: {
      name: 'Kinyarwanda',
      nativeName: 'Ikinyarwanda'
    },
    sa: {
      name: 'Sanskrit',
      nativeName: 'संस्कृतम्'
    },
    sc: {
      name: 'Sardinian',
      nativeName: 'sardu'
    },
    sd: {
      name: 'Sindhi',
      nativeName: 'सिन्धी'
    },
    se: {
      name: 'Northern Sami',
      nativeName: 'Davvisámegiella'
    },
    sg: {
      name: 'Sango',
      nativeName: 'yângâ tî sängö'
    },
    si: {
      name: 'Sinhala',
      nativeName: 'සිංහල'
    },
    sk: {
      name: 'Slovak',
      nativeName: 'slovenčina'
    },
    sl: {
      name: 'Slovenian',
      nativeName: 'slovenščina'
    },
    sm: {
      name: 'Samoan',
      nativeName: "gagana fa'a Samoa"
    },
    sn: {
      name: 'Shona',
      nativeName: 'chiShona'
    },
    so: {
      name: 'Somali',
      nativeName: 'Soomaaliga'
    },
    sq: {
      name: 'Albanian',
      nativeName: 'Shqip'
    },
    sr: {
      name: 'Serbian',
      nativeName: 'српски језик'
    },
    ss: {
      name: 'Swati',
      nativeName: 'SiSwati'
    },
    st: {
      name: 'Southern Sotho',
      nativeName: 'Sesotho'
    },
    su: {
      name: 'Sundanese',
      nativeName: 'Basa Sunda'
    },
    sv: {
      name: 'Swedish',
      nativeName: 'Svenska'
    },
    sw: {
      name: 'Swahili',
      nativeName: 'Kiswahili'
    },
    ta: {
      name: 'Tamil',
      nativeName: 'தமிழ்'
    },
    te: {
      name: 'Telugu',
      nativeName: 'తెలుగు'
    },
    tg: {
      name: 'Tajik',
      nativeName: 'тоҷикӣ'
    },
    th: {
      name: 'Thai',
      nativeName: 'ไทย'
    },
    ti: {
      name: 'Tigrinya',
      nativeName: 'ትግርኛ'
    },
    tk: {
      name: 'Turkmen',
      nativeName: 'Türkmençe'
    },
    tl: {
      name: 'Tagalog',
      nativeName: 'Wikang Tagalog'
    },
    tn: {
      name: 'Tswana',
      nativeName: 'Setswana'
    },
    to: {
      name: 'Tonga',
      nativeName: 'faka Tonga'
    },
    tr: {
      name: 'Turkish',
      nativeName: 'Türkçe'
    },
    ts: {
      name: 'Tsonga',
      nativeName: 'Xitsonga'
    },
    tt: {
      name: 'Tatar',
      nativeName: 'татар теле'
    },
    tw: {
      name: 'Twi',
      nativeName: 'Twi'
    },
    ty: {
      name: 'Tahitian',
      nativeName: 'Reo Tahiti'
    },
    ug: {
      name: 'Uyghur',
      nativeName: 'ئۇيغۇرچە‎'
    },
    uk: {
      name: 'Ukrainian',
      nativeName: 'Українська'
    },
    ur: {
      name: 'Urdu',
      nativeName: 'اردو'
    },
    uz: {
      name: 'Uzbek',
      nativeName: 'Ўзбек'
    },
    ve: {
      name: 'Venda',
      nativeName: 'Tshivenḓa'
    },
    vi: {
      name: 'Vietnamese',
      nativeName: 'Tiếng Việt'
    },
    vo: {
      name: 'Volapük',
      nativeName: 'Volapük'
    },
    wa: {
      name: 'Walloon',
      nativeName: 'walon'
    },
    wo: {
      name: 'Wolof',
      nativeName: 'Wollof'
    },
    xh: {
      name: 'Xhosa',
      nativeName: 'isiXhosa'
    },
    yi: {
      name: 'Yiddish',
      nativeName: 'ייִדיש'
    },
    yo: {
      name: 'Yoruba',
      nativeName: 'Yorùbá'
    },
    za: {
      name: 'Zhuang',
      nativeName: 'Saɯ cueŋƅ'
    },
    zh: {
      name: 'Chinese',
      nativeName: '中文'
    },
    zu: {
      name: 'Zulu',
      nativeName: 'isiZulu'
    }
  };

  class ISO6391 {
    static getLanguages(codes = []) {
      return codes.map(code => ({
        code,
        name: ISO6391.getName(code),
        nativeName: ISO6391.getNativeName(code)
      }));
    }

    static getName(code) {
      return ISO6391.validate(code) ? LANGUAGES_LIST[code].name : '';
    }

    static getAllNames() {
      return Object.values(LANGUAGES_LIST).map(l => l.name);
    }

    static getNativeName(code) {
      return ISO6391.validate(code) ? LANGUAGES_LIST[code].nativeName : '';
    }

    static getAllNativeNames() {
      return Object.values(LANGUAGES_LIST).map(l => l.nativeName);
    }

    static getCode(name) {
      const code = Object.keys(LANGUAGES_LIST).find(code => {
        const language = LANGUAGES_LIST[code];

        return language.name.toLowerCase() === name.toLowerCase() || language.nativeName.toLowerCase() === name.toLowerCase();
      });
      return code || '';
    }

    static getAllCodes() {
      return Object.keys(LANGUAGES_LIST);
    }

    static validate(code) {
      return LANGUAGES_LIST.hasOwnProperty(code);
    }
  }

  // http://multilinguale.webflow.io

  const defaultLang = "en";
  const langRegExp = /\[\[([a-z]{2})\]\]([^\[]+)/g;
  const isStorageEnabled = !(typeof localStorage == "undefined");
  const textDict = [];
  let userLang = (navigator.userLanguage || navigator.browserLanguage || navigator.language || defaultLang).substr(0, 2);
  let documentLang;

  function getLangParam() {
    const arr = /lang=([a-z]{2})/g.exec(location.search);
    return arr ? arr[1] : null;
  }

  function getLangFromStorage() {
    return isStorageEnabled ? localStorage.getItem("lang") : undefined;
  }

  function setLang(lang) {
    userLang = lang;
    if (isStorageEnabled) {
      localStorage.setItem("lang", userLang);
    }
    console.log("[wm] setLang:", lang, userLang);
    applyLang();
  }

  function applyLang() {
    textDict.forEach(o => {
      o.el.textContent = o.dict[userLang];
    });

    ISO6391.getAllCodes().forEach(lang => {
      lang === userLang ? document.querySelectorAll(`.wm-${lang}`).forEach(el => el.style.display = el.dataset.wmDisplay) : document.querySelectorAll(`.wm-${lang}`).forEach(el => el.style.display = "none");
    });
  }

  function textNodesUnder(el) {
    let node;
    const nodes = [];
    const walk = document.createTreeWalker(el, NodeFilter.SHOW_TEXT, null, false);

    while (node = walk.nextNode()) {
      nodes.push(node);
    }
    return nodes;
  }

  // https://medium.com/@roxeteer/javascript-one-liner-to-get-elements-text-content-without-its-child-nodes-8e59269d1e71
  function parentElTextOnly(el) {
    return Array.from(el.childNodes).reduce((acc, node) => {
      return acc + (node.nodeType === 3 ? node.textContent : "");
    }, "");
  }

  window.addEventListener("DOMContentLoaded", init);

  function init() {
    let langs = new Set();
    userLang = getLangParam() || getLangFromStorage() || userLang;
    if (isStorageEnabled) {
      localStorage.setItem("lang", userLang);
    }

    ISO6391.getAllCodes().forEach(lang => {
      document.querySelectorAll(`.wm-${lang}`).forEach(el => el.dataset.wmDisplay = el.style.display);
    });

    textNodesUnder(document).filter(node => {
      return langRegExp.test(parentElTextOnly(node.parentElement));
    }).forEach((node, i) => {
      const dict = {};
      let arr;
      while ((arr = langRegExp.exec(parentElTextOnly(node.parentElement))) != null) {
        dict[arr[1]] = arr[2];
        langs.add(arr[1]);
      }
      textDict.push({
        el: node.parentElement,
        dict
      });
    });
    console.log("[wm] documentLang:", documentLang);
    documentLang = DocumentLang(langs, userLang);
    applyLang();
  }

  /////////////////////////

  window.addEventListener("DOMContentLoaded", addSelectLangButtonEvent);

  function addSelectLangButtonEvent() {
    document.querySelectorAll("[data-wm-sel]").forEach(el => {
      el.addEventListener("click", evt => {
        evt.stopPropagation();
        evt.preventDefault();
        console.log("[wm] click:", el.dataset.wmSel);
        setLang(el.dataset.wmSel);
      });
    });
  }

  ///////////////////////////

  function DocumentLang(langsSet, userLang) {
    const langs = Array.from(langsSet);
    let cur = langs.indexOf(userLang);
    const next = () => {
      if (cur < langs.length) {
        return langs[cur++];
      } else {
        cur = 0;
        return langs[0];
      }
    };
    const nextVal = () => {
      if (cur + 1 < langs.length) {
        return langs[cur + 1];
      } else {
        return langs[0];
      }
    };
    const curVal = () => langs[cur];

    return {
      next,
      nextVal,
      curVal
    };
  }

  window.addEventListener("DOMContentLoaded", addSwitchLangButtonEvent);

  function addSwitchLangButtonEvent() {
    document.querySelectorAll("[data-wm-switch]").forEach(el => {
      if (documentLang.curVal() === userLang) {
        el.textContent = ISO6391.getName(documentLang.nextVal());
      } else {
        el.textContent = ISO6391.getName(documentLang.curVal());
      }

      el.addEventListener("click", evt => {
        evt.stopPropagation();
        evt.preventDefault();
        let nextLang = documentLang.next();
        if (nextLang === userLang) {
          nextLang = documentLang.next();
        }
        setLang(nextLang);
        el.textContent = ISO6391.getName(documentLang.nextVal());
        console.log("[wm] switch:", nextLang);
      });
    });
  }

  exports.DocumentLang = DocumentLang;
  exports.addSelectLangButtonEvent = addSelectLangButtonEvent;
  exports.addSwitchLangButtonEvent = addSwitchLangButtonEvent;
  exports.applyLang = applyLang;
  exports.init = init;
  exports.setLang = setLang;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
