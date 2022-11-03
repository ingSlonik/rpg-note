import React, { ReactNode, useEffect, useMemo, useState } from 'react';

import Split from "react-split";
import easyDB from "easy-db-browser";

import { mdiFountainPen, mdiArmFlex, mdiSword } from '@mdi/js';

import Editor, { EditorProps } from './Editor';
import { colors } from './colors';
import { ButtonIcon, Flex } from './Components';


const COLLECTION_STORED_STATE = "rpg-note-state";
const { select, update } = easyDB({});

enum Page {
  Skills,
  Equipment,
  Note,
}

type StoredStateRow<T> = {
  key: string,
  value: T,
}

function useStoredState<T>(key: string, defaultState: T): [T, (state: T) => void] {
  const [state, setState] = useState(defaultState);

  useEffect(() => {
    select<StoredStateRow<T>>(COLLECTION_STORED_STATE, key).then(row => {
      if (row && "value" in row) {
        setState(row.value);
      }
    });
  }, [key]);

  const set = useMemo(() => {
    return (state: T) => {
      setState(state);
      update(COLLECTION_STORED_STATE, key, { key, value: state });
    }
  }, [key]);

  return [state, set];
}


export default function App() {
  const [page, setPage] = useState(Page.Note);

  return <Split
    style={{ display: "flex", flexGrow: 1, backgroundColor: colors.backgroundSecondary }}
    sizes={[20, 80]}
    minSize={200}
    direction="horizontal"
  >
    <Flex>
      <Flex align="center">
        <Flex row align="center">
          <img src="/logo192.png" alt="RPG note logo" style={{ height: "48px", width: "48px" }} />
          <h1>RPG note</h1>
        </Flex>
        <div style={{
          width: "200px", height: "250px",
          backgroundImage: "url(/kelvin-face.png)",
          backgroundPosition: "center",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
          borderRadius: "100px 100px 0px 0px",
          boxShadow: "0px 0px 16px rgba(0,0,0,0.9)"
        }} />
        <h2 style={{ fontSize: "40px" }}>Kelvin</h2>
        <p>gnome mág z Gnomereganu</p>
      </Flex>
      <Content storageKey="role" noToolbar />
    </Flex>
    <Flex>
      {/* <Flex row justify="center" style={{ backgroundColor: colors.primaryLight, padding: "4px", borderRadius: "0px 0px 8px 8px" }}>
        <Button active={page === Page.Skills} onClick={() => setPage(Page.Skills)}>Dovednosti</Button>
        <Button active={page === Page.Equipment} onClick={() => setPage(Page.Equipment)}>Vybavení</Button>
        <Button active={page === Page.Note} onClick={() => setPage(Page.Note)}>Poznámky</Button>
      </Flex> */}
      <Split style={{ display: "flex", flexDirection: "column", flexGrow: 1 }} direction="vertical">
        <Flex grow={1} style={{ position: "relative" }}>
          {page === Page.Skills && <Content title="Dovednosti" storageKey="skills" />}
          {page === Page.Equipment && <Content title="Vybavení" storageKey="equipment" />}
          {page === Page.Note && <Content title="Poznámky" storageKey="note" />}

          <Flex align="flex-end" style={{ position: "absolute", zIndex: 5, bottom: "16px", right: "16px" }}>
            <ButtonIcon icon={mdiArmFlex} text="Dovednosti" active={page === Page.Skills} onClick={() => setPage(Page.Skills)} />
            <div style={{ height: "8px" }} />
            <ButtonIcon icon={mdiSword} text="Vybavení" active={page === Page.Equipment} onClick={() => setPage(Page.Equipment)} />
            <div style={{ height: "8px" }} />
            <ButtonIcon icon={mdiFountainPen} text="Poznámky" active={page === Page.Note} onClick={() => setPage(Page.Note)} />
          </Flex>
        </Flex>
        <Split style={{ display: "flex", flexGrow: 1 }} direction="horizontal">
          <Content title="Postavy" storageKey="characters" />
          <Content title="Akční poznámky" storageKey="action-note" />
        </Split>
      </Split>
    </Flex>
  </Split>;
}

function Content({ storageKey, title, ...editorProps }: { storageKey: string, title?: string } & Partial<EditorProps>) {
  const [text, setText] = useStoredState(storageKey, "");

  return <Flex grow={1} basis={100}>
    {title && <h3 style={{ paddingLeft: "8px", margin: "2px" }}>{title}</h3>}
    <Flex grow={1} style={{ backgroundColor: colors.backgroundPrimary, borderRadius: "16px 16px 0px 0px" }}>
      <Editor {...editorProps} value={text} onChange={setText} />
    </Flex>
  </Flex>
}