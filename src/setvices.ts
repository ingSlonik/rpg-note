import { useState, useEffect, useMemo } from "react";

import easyDB from "easy-db-browser";

import packageInfo from "../package.json";

export enum StorageKey {
    Theme = "theme",

    Name = "name",
    Motto = "motto",
    Picture = "picture",
    Role = "role",
    Characters = "characters",
    ActionNote = "actionNote",
    Skills = "skills",
    Equipment = "equipment",
    Note = "note",
};

export type Save = {
    app: string,
    version: string,
} & { [key in StorageKey]: string };

type StoredStateRow<T = string> = {
    key: string,
    value: T,
};


const COLLECTION_STORED_STATE = "rpg-note-state";
const { select, update } = easyDB({});

export const EMPTY_SAVE: Save = {
    app: packageInfo.name,
    version: packageInfo.version,

    theme: "light",

    picture: "",
    name: "Hero",
    motto: "The hero of the notebooks",
    role: "<h3>Stav</h3><p>❤️&#9;10 životů (max 20)</p><p>🍾&#9;10 many (max 20)</p><p>💰&#9;10 gold 9 silver 8 copper</p><p>⏳&#9;1. ledna 12021</p><p>⛅&#9;pěkný den</p><br><p>Rychlá kapsa:</p><p>-</p>",
    characters: "",
    actionNote: "",
    equipment: "",
    note: "",
    skills: "",
};


async function updateStoredValue(key: StorageKey, value: string) {
    await update(COLLECTION_STORED_STATE, key, { key, value });
}

export async function getDataForSave() {
    const data = await select<StoredStateRow>(COLLECTION_STORED_STATE);

    const saveData: Partial<Save> = {
        app: packageInfo.name,
        version: packageInfo.version,
    };

    for (const key of Object.values(StorageKey)) {
        const row = data[key];
        if (row !== null && typeof row === "object" && typeof row.value === "string") {
            saveData[key] = row.value;
        } else {
            saveData[key] = "";
        }
    }

    return saveData as Save;
}
export async function updateCollection(load: Save) {
    for (const key of Object.values(StorageKey)) {
        await updateStoredValue(key, load[key]);
    }
}

export function checkLoadFile(text: string): null | Save {
    try {
        const f = JSON.parse(text);

        if (typeof f !== "object" || f === null) return null;

        if (f.app !== packageInfo.name) return null;
        if (typeof f.version !== "string") return null;

        for (const key of Object.values(StorageKey)) {
            if (typeof f[key] !== "string") return null;
        }

        return f;
    } catch (e) {
        return null;
    }
}


export function useStoredState(key: StorageKey): [state: string, setState: (state: string) => void, reload: () => void] {
    const [change, setChange] = useState(false);
    const [state, setState] = useState(EMPTY_SAVE[key]);

    useEffect(() => {
        select<StoredStateRow>(COLLECTION_STORED_STATE, key).then(row => {
            if (row && "value" in row && typeof row.value === "string") {
                setState(row.value);
            }
        });
    }, [key, change]);

    const set = useMemo(() => {
        return (state: string) => {
            setState(state);
            updateStoredValue(key, state);
        }
    }, [key]);

    const reload = useMemo(() => {
        return () => setChange(ch => !ch);
    }, []);

    return [state, set, reload];
}
