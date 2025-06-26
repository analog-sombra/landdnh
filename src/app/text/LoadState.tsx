"use client";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect } from "react";

const LoadState = () => {
  const text =
    '{"root":{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"this is ","type":"text","version":1},{"detail":0,"format":2,"mode":"normal","style":"","text":"so","type":"text","version":1},{"detail":0,"format":0,"mode":"normal","style":"","text":" ","type":"text","version":1},{"detail":0,"format":1,"mode":"normal","style":"","text":"good","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""}],"direction":"ltr","format":"","indent":0,"type":"root","version":1}}';

  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    const newState = editor.parseEditorState(text);
    editor.setEditorState(newState);
    editor.setEditable(true);
  }, []);

  return <div>Load State</div>;
};

export default LoadState;
