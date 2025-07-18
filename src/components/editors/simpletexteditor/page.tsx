"use client";

import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { Dispatch, SetStateAction, useEffect } from "react";

import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { mergeRegister } from "@lexical/utils";

const theme = {
  root: "p-2 border border-gray-300 rounded-md min-h-[80px] focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500",
  paragraph: "mb-1",
};

// Catch any errors that occur during Lexical updates and log them
function onError(error: Error) {
  console.error(error);
}

interface SimpleEditorProps {
  setQueryData: Dispatch<SetStateAction<string>>;
  placeholder?: string;
  onChange?: (value: string) => void; // This will now receive JSON string
  initialValue?: string; // Can accept either JSON string or plain text
}

export const SimpleTextEditor = ({
  placeholder = "Enter text...",
  setQueryData,
  onChange,
}: SimpleEditorProps) => {
  const initialConfig = {
    namespace: "SimpleTextEditor",
    nodes: [HeadingNode, QuoteNode],
    theme,
    onError,
  };

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className="relative">
        <ToolBar setQueryData={setQueryData} />
        <RichTextPlugin
          contentEditable={
            <ContentEditable
              className="outline-none"
              style={{ minHeight: "80px" }}
            />
          }
          placeholder={
            <div className="absolute top-2 left-2 text-gray-400 pointer-events-none">
              {placeholder}
            </div>
          }
          ErrorBoundary={LexicalErrorBoundary}
        />
        <OnChangePlugin
          onChange={(editorState, editor, tags) => {
            if (onChange) {
              editorState.read(() => {
                onChange(JSON.stringify(editorState));
              });
            }
          }}
        />
        <HistoryPlugin />
      </div>
    </LexicalComposer>
  );
};

interface ToolBarProps {
  setQueryData: Dispatch<SetStateAction<string>>;
}
const ToolBar = ({ setQueryData }: ToolBarProps) => {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(
        ({ editorState, dirtyElements, dirtyLeaves }) => {
          editorState.read(() => {
            // console.log(JSON.stringify(editorState));
            setQueryData(JSON.stringify(editorState));
          });
        }
      )
    );
  }, [editor]);
  return <></>;
};
