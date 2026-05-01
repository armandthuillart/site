const locales = ["en", "fr"] as const;

export const languages: Record<(typeof locales)[number], string> = {
  en: "English",
  fr: "Français",
};

export const ui = {
  en: {
    "nav:home": "Home",
    quotes: {
      1: "Character is destiny.",
      2: "Become who you are.",
      3: "Believe you can and you're halfway there.",
      4: "He who is brave is free.",
      5: "Know thyself.",
      6: "Don’t dream of winning, train for it.",
      7: "More work than you want, less than you fear.",
      8: "See things as they are.",
      9: "Rest, but don’t quit.",
      10: "The place to find who you are is where you stand.",
    },
  },
  fr: {
    "nav:home": "Accueil",
    quotes: {
      1: "Le caractère, c’est le destin.",
      2: "Deviens qui tu es.",
      3: "Crois que tu peux, et tu es déjà à mi-chemin.",
      4: "Celui qui est courageux est libre.",
      5: "Connais-toi toi-même.",
      6: "Ne rêve pas de gagner, entraîne-toi pour y arriver.",
      7: "Plus de travail que tu ne veux, moins que tu ne crains.",
      8: "Vois les choses telles qu’elles sont.",
      9: "Repose-toi, mais n’abandonne pas.",
      10: "L’endroit pour te trouver, c’est là où tu te tiens.",
    },
  },
} as const;
