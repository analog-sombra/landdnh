"use client";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect } from "react";

interface LoadStateProps {
  data: string;
}

const LoadState = (props: LoadStateProps) => {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    const newState = editor.parseEditorState(props.data);
    editor.setEditorState(newState);
  }, []);

  return <></>;
};

export default LoadState;
