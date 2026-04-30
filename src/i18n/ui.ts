export const locales = ["en", "fr"] as const;

export const languages = {
  en: "English",
  fr: "Français",
};

export const defaultLang = "en";

export const ui = {
  en: {
    "nav:home": "Home",
    quotes: {
      goethe: "Whatever you can do, begin it.",
      heraclitus: "Character is destiny.",
      nietzsche: "Become who you are.",
      sartres: "Commitment is an act, not a word.",
      seneca: "He who is brave is free.",
      socrates: "Know thyself.",
    },
  },
  fr: {
    "nav:home": "Accueil",
    quotes: {
      goethe: "Quoi que tu puisses faire, commence-le.",
      heraclitus: "Le caractère est le destin.",
      nietzsche: "Deviens ce que tu es.",
      sartres: "La volonté de faire est la volonté de vivre.",
      seneca: "Celui qui est courageux est libre.",
      socrates: "Connais-toi toi-même.",
    },
  },
} as const;
