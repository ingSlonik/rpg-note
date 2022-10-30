import React, { useEffect, useRef, useState } from "react";

import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

// import { Editor as EditorDraft, EditorState, ContentState, convertFromRaw, convertToRaw } from 'draft-js';

// import Monaco from "@monaco-editor/react";
// import ReactMarkdown from 'react-markdown';

type EditorProps = {
    value: string,
    onChange: (value: string) => void,
}

export default function Editor({ value, onChange }: EditorProps) {

    return <div style={{ flexGrow: 1, position: "relative" }}>
        <ReactQuill
            value={value}
            onChange={onChange}
        />
    </div>;
}

/* draft-js
export default function Editor({ value, onChange }: EditorProps) {
    const editor = useRef<null | EditorDraft>(null);
    const [editorState, setEditorState] = useState(EditorState.createWithContent(ContentState.createFromText(value)));

    function focusEditor() {
        editor.current?.focus();
    }

    useEffect(() => {
        focusEditor()
    }, []);

    console.log(convertToRaw(editorState.getCurrentContent()));

    return <div style={{ flexGrow: 1, position: "relative" }}>
        <EditorDraft
            ref={editor}
            editorState={editorState}
            onChange={editorState => setEditorState(editorState)}
        />
    </div>;
}

/* MarkDown
export default function Editor({ value, onChange }: EditorProps) {

    const [show, setShow] = useState<"code" | "text">("code")

    return <div style={{ flexGrow: 1, position: "relative", overflow: "hidden", width: "100%" }}>
        <div style={{ position: "absolute", top: "16px", right: "16px", zIndex: 10 }}>
            <button onClick={() => setShow("code")}>code</button>
            <button onClick={() => setShow("text")}>text</button>
        </div>
        {show === "code" && <Monaco
            height={"100%"}
            width={"90%"}
            language="markdown"

            theme="light"

            value={value}
            onChange={value => {
                if (typeof value === "string")
                    onChange(value)
            }}
        />}
        {show === "text" && <div style={{ flexGrow: 1, overflow: "scroll" }}>
            <ReactMarkdown>{value}</ReactMarkdown>
        </div>}
    </div>;
}
*/