"use client";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect } from "react";

const LoadState = () => {
  // const text = "";
 

  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    // const newState = editor.parseEditorState(text);
    // editor.setEditorState(newState);
    editor.setEditable(true);
  }, []);

  return <div>Load State</div>;
};

export default LoadState;
