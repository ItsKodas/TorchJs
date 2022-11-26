//? Dependencies

import { basicSetup } from "codemirror"
import { EditorView, keymap } from "@codemirror/view"
import { EditorState } from "@codemirror/state"
import { defaultKeymap, indentWithTab } from "@codemirror/commands"

import { xml } from "@codemirror/lang-xml"
import { json } from "@codemirror/lang-json"

import { oneDarkTheme } from "@codemirror/theme-one-dark"



//? Editor

let startState = EditorState.create({
    extensions: [
        basicSetup,
        keymap.of([defaultKeymap, indentWithTab]),
        xml(),
        oneDarkTheme
    ]
})


export let newEditor = () => {
    const view = new EditorView({
        parent: document.getElementById('editor'),
        state: startState
    })

    return view
}