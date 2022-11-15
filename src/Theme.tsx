import React, { createContext, ReactNode, useContext } from "react";

import { Flex } from "./Components";
import { StorageKey, useStoredState } from "./setvices";

export type Theme = "light" | "dark" | "parchment";

type Colors = {
    primary: string,
    primaryDark: string,
    primaryLight: string,
    text: string,
    textDark: string,
    textLight: string,
    backgroundPrimary: string,
    backgroundSecondary: string,
}

type ThemeContextProps = {
    theme: Theme,
    setTheme: (theme: Theme) => void,
};

const ThemeContext = createContext<ThemeContextProps>({ theme: "light", setTheme: () => { } });

function getTheme(theme: string): Theme {
    switch (theme) {
        case "light": return "light";
        case "dark": return "dark";
        case "parchment": return "parchment";
        default:
            console.warn(`Unknown theme "${theme}"!`);
            return "light";
    }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
    const [themeString, setTheme] = useStoredState(StorageKey.Theme);
    const theme = getTheme(themeString);
    const colors = themeColors[theme];

    return <ThemeContext.Provider value={{ theme, setTheme }}>
        <Flex style={{ color: colors.text, backgroundColor: colors.backgroundSecondary }}>
            {children}
        </Flex>
    </ThemeContext.Provider>
}

export function useTheme() {
    return useContext(ThemeContext);
}

export function useColors(): Colors {
    const { theme } = useContext(ThemeContext);

    return themeColors[theme];
}

const themeColors: { [key in Theme]: Colors } = {
    light: {
        primary: "#388e3c",
        primaryDark: "#00600f",
        primaryLight: "#6abf69",
        text: "#000000",
        textDark: "#FFFFFF",
        textLight: "#000000",
        backgroundPrimary: "#f5f5f6",
        backgroundSecondary: "#e1e2e1",
    },
    dark: {
        primary: "#388e3c",
        primaryDark: "#00600f",
        primaryLight: "#6abf69",
        text: "#DDDDDD",
        textDark: "#FFFFFF",
        textLight: "#000000",
        backgroundPrimary: "#1d1d1d",
        backgroundSecondary: "#121212",
    },
    parchment: {
        primary: "#8d6e63",
        primaryDark: "#5f4339",
        primaryLight: "#be9c91",
        text: "#000000",
        textDark: "#FFFFFF",
        textLight: "#000000",
        backgroundPrimary: "#ccb78f",
        backgroundSecondary: "#9d7236",
    }
};
