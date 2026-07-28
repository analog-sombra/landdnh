"use client";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect } from "react";

const LoadState = () => {
  const text = '{"root":{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Report is Final","type":"text","version":1},{"type":"linebreak","version":1},{"type":"linebreak","version":1},{"detail":0,"format":1,"mode":"normal","style":"","text":"Fd.w.cs.","type":"text","version":1},{"detail":0,"format":0,"mode":"normal","style":"","text":" to the ","type":"text","version":1},{"detail":0,"format":1,"mode":"normal","style":"","text":"Land Acquisition Officer, D&NH,","type":"text","version":1},{"detail":0,"format":0,"mode":"normal","style":"","text":" Silvassa with a request to please state whether there is any land acquisition proposal on the subject land or land is contemplated to be acquired within a period of 10 days positively.","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"code","version":1}],"direction":"ltr","format":"","indent":0,"type":"root","version":1}}';
 

  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    const newState = editor.parseEditorState(text);
    editor.setEditorState(newState);
    editor.setEditable(true);
  }, []);

  return <div>Load State</div>;
};

export default LoadState;
