import React, { useEffect, useMemo, useState } from 'react';

import Split from "react-split";
import easyDB from "easy-db-browser";

import Editor from './Editor';


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

  const [role, setRole] = useStoredState("role", "<h1>Jméno</h1>");
  const [note, setNote] = useStoredState("note", "");

  const [characters, setCharacters] = useStoredState("characters", "");
  const [actionNote, setActionNote] = useStoredState("action-note", "");
  console.log(role)
  return <Split style={{ display: "flex", flexGrow: 1 }} sizes={[20, 80]} direction="horizontal">
    <div style={{ display: "flex", flexDirection: "column", backgroundColor: "#AAFFAA" }}>
      <div style={{ border: "1px solid black", width: "200px", height: "200px", borderRadius: "100px" }}>
        FOTO
      </div>
      <Editor value={role} onChange={setRole} />
    </div>
    <div style={{ display: "flex", flexDirection: "column", flexGrow: 1 }}>
      <nav style={{ boxShadow: "2px 2px 8px rgba(0,0,0,0.5)" }}>
        <button onClick={() => setPage(Page.Skills)}>Dovednosti</button>
        <button onClick={() => setPage(Page.Equipment)}>Vybavení</button>
        <button onClick={() => setPage(Page.Note)}>Poznámky</button>
      </nav>
      <Split style={{ display: "flex", flexDirection: "column", flexGrow: 1 }} direction="vertical">
        <div style={{ display: "flex", flexDirection: "column", flexGrow: 1 }}>
          {page === Page.Skills && <h2>Dovednosti</h2>}
          {page === Page.Equipment && <h2>Vybavení</h2>}

          {page === Page.Note && <>
            <h2>Poznámky</h2>
            <Editor value={note} onChange={setNote} />
          </>}
        </div>
        <Split style={{ display: "flex", flexGrow: 1 }} direction="horizontal">
          <div style={{ display: "flex", flexDirection: "column", flexGrow: 1 }}>
            Postavy
            <Editor value={characters} onChange={setCharacters} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", flexGrow: 1 }}>
            Akční poznámky
            <Editor value={actionNote} onChange={setActionNote} />
          </div>
        </Split>
      </Split>
    </div>
  </Split>;
}

