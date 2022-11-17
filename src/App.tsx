import React, { CSSProperties, useEffect, useRef, useState } from 'react';
import {
  mdiFloppy, mdiUpload, mdiFountainPen, mdiArmFlex, mdiSword, mdiDeleteOutline, mdiCog, mdiPalette, mdiEarth,
  mdiBrightness5, mdiBrightness7, mdiPaperRollOutline,
} from '@mdi/js';

import Split from "react-split";
import { resizeImage } from "easy-image-resizer";

import Editor, { EditorProps } from './Editor';
import { ButtonIcon, Flex } from './Components';

import packageInfo from "../package.json";
import { checkLoadFile, EMPTY_SAVE, getDataForSave, StorageKey, updateCollection, useStoredState } from './setvices';
import { useColors, useTheme } from './Theme';
import { L, useLang, useLanguage } from './Language';

enum Menu {
  File,
  Style,
  Language,
}

enum Page {
  Skills,
  Equipment,
  Note,
};

const PICTURE_SIZE = { width: 200, height: 250 };


export default function App() {
  const { theme, setTheme } = useTheme();
  const { language, setLanguage } = useLanguage();
  const l = useLang();

  const fileInput = useRef<null | HTMLInputElement>(null);
  const [menu, setMenu] = useState<null | Menu>(null);

  const [page, setPage] = useState(Page.Note);

  const [picture, setPicture, reloadPicture] = useStoredState(StorageKey.Picture);

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
    const url = await resizeImage(file, { maxWidth: PICTURE_SIZE.width * 2, height: PICTURE_SIZE.height * 2 });
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
    style={{ display: "flex", flexGrow: 1 }}
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
            <L k="title" />
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
            <ButtonIcon icon={mdiCog} text={l("file")} open={menu === Menu.File} active={menu === Menu.File} onClick={() => setMenu(menu === Menu.File ? null : Menu.File)} />
            <div style={{ width: "8px" }} />
            <ButtonIcon icon={mdiEarth} text={l("language")} open={menu === Menu.Language} active={menu === Menu.Language} onClick={() => setMenu(menu === Menu.Language ? null : Menu.Language)} />
            <div style={{ width: "8px" }} />
            <ButtonIcon icon={mdiPalette} text={l("style")} open={menu === Menu.Style} active={menu === Menu.Style} onClick={() => setMenu(menu === Menu.Style ? null : Menu.Style)} />
          </Flex>

          <Flex align="flex-end" style={{ position: "absolute", zIndex: 15, top: "52px", right: "104px", height: menu === Menu.File ? "162px" : "0px", overflow: "hidden", minWidth: "152px", transition: "0.3s" }}>
            <ButtonIcon open icon={mdiFloppy} text={l("save")} onClick={handleSave} />
            <div style={{ height: "8px" }} />
            <ButtonIcon open icon={mdiUpload} text={l("load")} onClick={handleLoadDialog} />
            <div style={{ height: "8px" }} />
            <ButtonIcon open icon={mdiDeleteOutline} text={l("removeAll")} onClick={handleDelete} />
          </Flex>

          <Flex align="flex-end" style={{ position: "absolute", zIndex: 15, top: "52px", right: "52px", height: menu === Menu.Language ? "162px" : "0px", overflow: "hidden", minWidth: "152px", transition: "0.3s" }}>
            <ButtonIcon open text={l("czech")} active={language === "cs"} onClick={() => setLanguage("cs")} />
            <div style={{ height: "8px" }} />
            <ButtonIcon open text={l("english")} active={language === "en"} onClick={() => setLanguage("en")} />
          </Flex>

          <Flex align="flex-end" style={{ position: "absolute", zIndex: 15, top: "52px", right: "4px", height: menu === Menu.Style ? "162px" : "0px", overflow: "hidden", minWidth: "152px", transition: "0.3s" }}>
            <ButtonIcon open icon={mdiBrightness5} text={l("light")} active={theme === "light"} onClick={() => setTheme("light")} />
            <div style={{ height: "8px" }} />
            <ButtonIcon open icon={mdiBrightness7} text={l("dark")} active={theme === "dark"} onClick={() => setTheme("dark")} />
            <div style={{ height: "8px" }} />
            <ButtonIcon open icon={mdiPaperRollOutline} text={l("parchment")} active={theme === "parchment"} onClick={() => setTheme("parchment")} />
          </Flex>

          {page === Page.Skills && <Content title={l("skills")} storageKey={StorageKey.Skills} reload={reload} />}
          {page === Page.Equipment && <Content title={l("equipment")} storageKey={StorageKey.Equipment} reload={reload} />}
          {page === Page.Note && <Content title={l("note")} storageKey={StorageKey.Note} reload={reload} />}

          <Flex align="flex-end" style={{ position: "absolute", zIndex: 5, bottom: "16px", right: "16px" }}>
            <ButtonIcon icon={mdiArmFlex} text={l("skills")} active={page === Page.Skills} onClick={() => setPage(Page.Skills)} />
            <div style={{ height: "8px" }} />
            <ButtonIcon icon={mdiSword} text={l("equipment")} active={page === Page.Equipment} onClick={() => setPage(Page.Equipment)} />
            <div style={{ height: "8px" }} />
            <ButtonIcon icon={mdiFountainPen} text={l("note")} active={page === Page.Note} onClick={() => setPage(Page.Note)} />
          </Flex>
        </Flex>
        <Split style={{ display: "flex", flexGrow: 1 }} direction="horizontal">
          <Content title={l("characters")} storageKey={StorageKey.Characters} reload={reload} />
          <Content title={l("actionNote")} storageKey={StorageKey.ActionNote} reload={reload} />
        </Split>
      </Split>
    </Flex>
  </Split>;
}

function Content({ storageKey, title, reload, ...editorProps }: { storageKey: StorageKey, reload: boolean, title?: string } & Partial<EditorProps>) {
  const colors = useColors();

  const [text, setText, reloadText] = useStoredState(storageKey);

  useEffect(() => {
    reloadText();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reload]);

  return <Flex grow={1} basis={100}>
    {title && <h3 style={{ paddingLeft: "8px", margin: "2px" }}>{title}</h3>}
    <Flex grow={1} style={{ background: colors.backgroundPrimary, borderRadius: "16px 16px 0px 0px" }}>
      <Editor {...editorProps} value={text} onChange={setText} />
    </Flex>
  </Flex>
}

function InputText({ style, storageKey, reload }: { style?: CSSProperties, storageKey: StorageKey, reload: boolean }) {
  const colors = useColors();

  const [focus, setFocus] = useState(false);
  const [text, setText, reloadText] = useStoredState(storageKey);

  useEffect(() => {
    reloadText();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reload]);

  return <input
    style={{
      color: colors.text,
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
