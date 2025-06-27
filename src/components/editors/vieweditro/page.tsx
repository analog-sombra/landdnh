"use client";

import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { CodeHighlightNode, CodeNode } from "@lexical/code";
import { TableNode, TableCellNode, TableRowNode } from "@lexical/table";
import LoadState from "./LoadState";

// Catch any errors that occur during Lexical updates and log them
// or throw them as needed. If you don't throw them, Lexical will
// try to recover gracefully without losing user data.
function onError(error: Error) {
  console.error(error);
}

// function MyOnChangePlugin({ onChange }) {
//   // Access the editor through the LexicalComposerContext
//   const [editor] = useLexicalComposerContext();
//   // Wrap our listener in useEffect to handle the teardown and avoid stale references.
//   useEffect(() => {
//     // most listeners return a teardown function that can be called to clean them up.
//     return editor.registerUpdateListener(({ editorState }) => {
//       // call onChange here to pass the latest state up to the parent.
//       onChange(editorState);
//     });
//   }, [editor, onChange]);
//   return null;
// }

interface EditorProps {
  data: string;
}

export const ViewEditor = (props: EditorProps) => {
  const initialConfig = {
    namespace: "MyEditor",
    theme: exampleTheme,
    onError,
    nodes: [
      HeadingNode,
      QuoteNode,
      CodeNode,
      CodeHighlightNode,
      TableNode,
      TableCellNode,
      TableRowNode,
    ],
    editable: false,
  };

  return (
    <div className="">
      <LexicalComposer initialConfig={initialConfig}>
        <LoadState data={props.data} />
        <RichTextPlugin
          contentEditable={
            <ContentEditable
              className="focus:outline-none"
              aria-placeholder={"Enter some text..."}
              placeholder={<div>Enter some text...</div>}
            />
          }
          ErrorBoundary={LexicalErrorBoundary}
        />
        <HistoryPlugin />
        <AutoFocusPlugin />
      </LexicalComposer>
    </div>
  );
};

const exampleTheme = {
  ltr: "ltr",
  rtl: "rtl",
  paragraph: "editor-paragraph",
  quote: "editor-quote",
  heading: {
    h1: "text-3xl font-bold",
    h2: "text-2xl font-bold",
    h3: "text-xl",
    h4: "text-lg",
    h5: "text-sm",
    h6: "text-xs",
  },
  list: {
    nested: {
      listitem: "editor-nested-listitem",
    },
    ol: "editor-list-ol",
    ul: "editor-list-ul",
    listitem: "editor-listItem",
    listitemChecked: "editor-listItemChecked",
    listitemUnchecked: "editor-listItemUnchecked",
  },
  hashtag: "editor-hashtag",
  image: "editor-image",
  link: "editor-link",
  text: {
    bold: "font-bold",
    code: "editor-textCode",
    italic: "italic",
    strikethrough: "line-through",
    subscript: "editor-textSubscript",
    superscript: "editor-textSuperscript",
    underline: "underline",
    underlineStrikethrough: "underline line-through",
  },
  code: "editor-code",
  codeHighlight: {
    atrule: "editor-tokenAttr",
    attr: "editor-tokenAttr",
    boolean: "editor-tokenProperty",
    builtin: "editor-tokenSelector",
    cdata: "editor-tokenComment",
    char: "editor-tokenSelector",
    class: "editor-tokenFunction",
    "class-name": "editor-tokenFunction",
    comment: "editor-tokenComment",
    constant: "editor-tokenProperty",
    deleted: "editor-tokenProperty",
    doctype: "editor-tokenComment",
    entity: "editor-tokenOperator",
    function: "editor-tokenFunction",
    important: "editor-tokenVariable",
    inserted: "editor-tokenSelector",
    keyword: "editor-tokenAttr",
    namespace: "editor-tokenVariable",
    number: "editor-tokenProperty",
    operator: "editor-tokenOperator",
    prolog: "editor-tokenComment",
    property: "editor-tokenProperty",
    punctuation: "editor-tokenPunctuation",
    regex: "editor-tokenVariable",
    selector: "editor-tokenSelector",
    string: "editor-tokenSelector",
    symbol: "editor-tokenProperty",
    tag: "editor-tokenProperty",
    url: "editor-tokenOperator",
    variable: "editor-tokenVariable",
  },
  table: "border-collapse my-4 w-full",
  tableCell: "border border-gray-200 px-3 py-2",
  tableCellHeader: "border border-gray-200 px-3 py-2 bg-gray-100 font-semibold",
  tableRow: "",
  // tableCellSelected: "bg-blue-100 border px-3 py-2",
  // tableHeaderCell: "border px-3 py-2 bg-gray-200 font-semibold",
  // tableHeaderCellSelected: "bg-blue-200 border px-3 py-2 font-bold",
};
