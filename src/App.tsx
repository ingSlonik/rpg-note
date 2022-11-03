import React, { CSSProperties, useEffect, useMemo, useRef, useState } from 'react';
import { mdiFloppy, mdiUpload, mdiFountainPen, mdiArmFlex, mdiSword, mdiDeleteOutline } from '@mdi/js';

import Split from "react-split";
import easyDB from "easy-db-browser";
import { resizeImage } from "easy-image-resizer";

import Editor, { EditorProps } from './Editor';
import { colors } from './colors';
import { ButtonIcon, Flex } from './Components';

import packageInfo from "../package.json";



enum StorageKey {
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

type Save = {
  app: string,
  version: string,
} & { [key in StorageKey]: string };

enum Page {
  Skills,
  Equipment,
  Note,
};

type StoredStateRow<T = string> = {
  key: string,
  value: T,
};

const COLLECTION_STORED_STATE = "rpg-note-state";
const { select, update } = easyDB({});

const PICTURE_SIZE = { width: 200, height: 250 };
const EMPTY_SAVE: Save = {
  app: packageInfo.name,
  version: packageInfo.version,
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

async function getDataForSave() {
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
async function updateCollection(load: Save) {
  for (const key of Object.values(StorageKey)) {
    await updateStoredValue(key, load[key]);
  }
}

function checkLoadFile(text: string): null | Save {
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

function useStoredState(key: StorageKey, defaultState: string): [state: string, setState: (state: string) => void, reload: () => void] {
  const [change, setChange] = useState(false);
  const [state, setState] = useState(defaultState);

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

export default function App() {
  const fileInput = useRef<null | HTMLInputElement>(null);
  const [page, setPage] = useState(Page.Note);

  const [picture, setPicture, reloadPicture] = useStoredState(StorageKey.Picture, "");

  const [reload, setReload] = useState(false);

  function handleReloadStoredState() {
    setReload(r => !r);
    reloadPicture();
  }

  function handleLoadDialog() {
    if (fileInput.current) {
      const input = fileInput.current;
      input.name = "load";
      input.accept = ".json";
      input.click();
    }
  }

  function handlePictureDialog() {
    if (fileInput.current) {
      const input = fileInput.current;
      input.name = "picture";
      input.accept = ".jpg,.jpeg,.png,.svg";
      input.click();
    }
  }

  function handleFile() {
    if (fileInput.current) {
      const input = fileInput.current;
      const file = input.files?.[0];

      if (file) {
        switch (input.name) {
          case "load": return handleLoad(file);
          case "picture": return handlePicture(file);
        }
      }
    }
  }

  async function handlePicture(file: File) {
    const url = await resizeImage(file, { maxWidth: 200 * 2, maxHeight: 250 * 2 });
    setPicture(url);
  }

  async function handleSave(e: any) {
    const save = await getDataForSave();
    const fileName = `${save.name.toLocaleLowerCase()}.json`;

    const a = e.target.closest("a");
    const file = new Blob([JSON.stringify(save, null, "\t")], { type: "application/json" });
    a.href = URL.createObjectURL(file);
    a.download = fileName;
  }

  async function handleLoad(file: File) {
    const text = await file.text();
    const load = checkLoadFile(text);

    if (load !== null) {
      await updateCollection(load);
      handleReloadStoredState();
    } else {
      // TODO: notify user
      console.log("Wrong format of loaded file.");
    }
  }

  async function handleDelete() {
    await updateCollection(EMPTY_SAVE);
    handleReloadStoredState();
  }

  return <Split
    style={{ display: "flex", flexGrow: 1, backgroundColor: colors.backgroundSecondary }}
    sizes={[20, 80]}
    minSize={200}
    direction="horizontal"
  >
    <Flex>
      <input ref={fileInput} type="file" style={{ display: "none" }} onChange={handleFile} />

      <Flex align="center" style={{ marginLeft: "16px", marginRight: "16px", marginBottom: "2px" }}>
        <Flex row align="center">
          <img src="/logo192.png" alt="RPG note logo" style={{ height: "48px", width: "48px" }} />
          <h1>
            RPG note
            <span style={{ paddingLeft: "8px", fontSize: "16px", opacity: 0.5 }}>v{packageInfo.version}</span>
          </h1>
        </Flex>
        <div
          style={{
            width: `${PICTURE_SIZE.width}px`,
            height: `${PICTURE_SIZE.height}px`,
            backgroundImage: `url(${picture ? picture : "/logo512.png"})`,
            backgroundPosition: picture ? "center center" : "center 45px",
            backgroundSize: picture ? "cover" : "contain",
            backgroundRepeat: "no-repeat",
            borderRadius: "100px 100px 0px 0px",
            boxShadow: "0px 0px 16px rgba(0,0,0,0.9)",
            marginBottom: "4px",

            cursor: "pointer",
          }}
          onClick={handlePictureDialog}
        />
        <InputText style={{ fontSize: "40px", fontWeight: "bold" }} storageKey={StorageKey.Name} reload={reload} />
        <InputText storageKey={StorageKey.Motto} reload={reload} />
      </Flex>
      <Content storageKey={StorageKey.Role} reload={reload} noToolbar />
    </Flex>
    <Flex>
      <Split style={{ display: "flex", flexDirection: "column", flexGrow: 1 }} direction="vertical">
        <Flex grow={1} style={{ position: "relative" }}>
          <Flex row style={{ position: "absolute", zIndex: 6, top: "4px", right: "4px" }}>
            <ButtonIcon icon={mdiFloppy} text="Uložit" onClick={handleSave} />
            <div style={{ width: "8px" }} />
            <ButtonIcon icon={mdiUpload} text="Načíst" onClick={handleLoadDialog} />
            <div style={{ width: "8px" }} />
            <ButtonIcon icon={mdiDeleteOutline} text="Vše smazat" onClick={handleDelete} />
          </Flex>

          {page === Page.Skills && <Content title="Dovednosti" storageKey={StorageKey.Skills} reload={reload} />}
          {page === Page.Equipment && <Content title="Vybavení" storageKey={StorageKey.Equipment} reload={reload} />}
          {page === Page.Note && <Content title="Poznámky" storageKey={StorageKey.Note} reload={reload} />}

          <Flex align="flex-end" style={{ position: "absolute", zIndex: 5, bottom: "16px", right: "16px" }}>
            <ButtonIcon icon={mdiArmFlex} text="Dovednosti" active={page === Page.Skills} onClick={() => setPage(Page.Skills)} />
            <div style={{ height: "8px" }} />
            <ButtonIcon icon={mdiSword} text="Vybavení" active={page === Page.Equipment} onClick={() => setPage(Page.Equipment)} />
            <div style={{ height: "8px" }} />
            <ButtonIcon icon={mdiFountainPen} text="Poznámky" active={page === Page.Note} onClick={() => setPage(Page.Note)} />
          </Flex>
        </Flex>
        <Split style={{ display: "flex", flexGrow: 1 }} direction="horizontal">
          <Content title="Postavy" storageKey={StorageKey.Characters} reload={reload} />
          <Content title="Akční poznámky" storageKey={StorageKey.ActionNote} reload={reload} />
        </Split>
      </Split>
    </Flex>
  </Split>;
}

function Content({ storageKey, title, reload, ...editorProps }: { storageKey: StorageKey, reload: boolean, title?: string } & Partial<EditorProps>) {
  const [text, setText, reloadText] = useStoredState(storageKey, "");

  useEffect(() => {
    reloadText();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reload]);

  return <Flex grow={1} basis={100}>
    {title && <h3 style={{ paddingLeft: "8px", margin: "2px" }}>{title}</h3>}
    <Flex grow={1} style={{ backgroundColor: colors.backgroundPrimary, borderRadius: "16px 16px 0px 0px" }}>
      <Editor {...editorProps} value={text} onChange={setText} />
    </Flex>
  </Flex>
}

function InputText({ style, storageKey, reload }: { style?: CSSProperties, storageKey: StorageKey, reload: boolean }) {
  const [focus, setFocus] = useState(false);
  const [text, setText, reloadText] = useStoredState(storageKey, "");

  useEffect(() => {
    reloadText();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reload]);

  return <input
    style={{
      borderBottomWidth: "2px",
      borderBottomStyle: "solid",
      borderBottomColor: focus ? colors.primary : "transparent",
      ...style,
    }}
    type="text"
    value={text}
    onFocus={() => setFocus(true)}
    onBlur={() => setFocus(false)}
    onChange={e => setText(e.target.value)}
  />
}
