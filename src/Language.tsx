import React, { createContext, ReactNode, useContext, useMemo } from "react";

import { StorageKey, useStoredState } from "./setvices";

export type Language = "cs" | "en";

type Dictionary = typeof cs & typeof en;

type LanguageContextProps = {
    language: Language,
    setLanguage: (language: Language) => void,
};

const cs = {
    title: "RPG note",

    note: "Poznámka",
    actionNote: "Akční poznámky",
    characters: "Postavy",
    equipment: "Vybavení",
    skills: "Dovednosti",

    light: "Světlé",
    dark: "Tmavé",
    parchment: "Pergamen",

    czech: "Čeština",
    english: "English",

    save: "Uložit",
    load: "Načíst",
    removeAll: "Smazat vše",

    style: "Styl",
    language: "Jazyk",
    file: "Soubor",
};

const en = {
    title: "RPG note",

    note: "Note",
    actionNote: "Action note",
    characters: "Characters",
    equipment: "Equipment",
    skills: "Skills",

    light: "Light",
    dark: "Dark",
    parchment: "Parchment",

    czech: "Čeština",
    english: "English",

    save: "Save",
    load: "Load",
    removeAll: "Remove all",

    style: "Theme",
    language: "Language",
    file: "File",
};

const languages: { [key in Language]: Dictionary } = { cs, en };

const LanguageContext = createContext<LanguageContextProps>({ language: "en", setLanguage: () => { } });

function getLanguage(language: string): Language {
    switch (language) {
        case "cs": return "cs";
        case "en": return "en";
        default:
            console.warn(`Unknown language "${language}"!`);
            return "en";
    }
}

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [languageString, setLanguage] = useStoredState(StorageKey.Language);
    const language = getLanguage(languageString);

    return <LanguageContext.Provider value={{ language, setLanguage }}>
        {children}
    </LanguageContext.Provider>;
}

export function useLanguage() {
    return useContext(LanguageContext);
}

export function useLang(): (key: keyof Dictionary) => string {
    const { language } = useContext(LanguageContext);

    return useMemo(() => {
        return (key: keyof Dictionary) => languages[language][key];
    }, [language]);
}

export function L({ k }: { k: keyof Dictionary }) {
    const l = useLang();
    return <>{l(k)}</>;
}