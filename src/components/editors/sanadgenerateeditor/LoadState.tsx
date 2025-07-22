"use client";
import { ApiCall } from "@/services/api";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

interface LoadStateProps {
  id: number;
}

interface QueryTypeResponseData {
  id: string;
  query: string;
  upload_url_1: string | null;
  type: string;
  request_type: string;
  createdAt: Date;
  from_user: {
    id: number;
    firstName: string;
    lastName: string;
    role: string;
  };
  to_user: {
    id: number;
    firstName: string;
    lastName: string;
    role: string;
  };
}
const LoadState = ({ id }: LoadStateProps) => {
  const pretext = "";
  const notingdata = useQuery({
    queryKey: ["getQueryByType", id, ["SANAD"]],
    queryFn: async () => {
      const response = await ApiCall({
        query:
          "query GetQueryByType($id: Int!, $querytype: [QueryType!]!) {getQueryByType(id: $id, querytype: $querytype) {id,query,upload_url_1,type,request_type,createdAt,from_user {id, firstName,lastName,role},to_user {id, firstName,lastName,role},}}",
        variables: {
          id: id,
          querytype: ["SANAD"],
        },
      });

      if (!response.status) {
        throw new Error(response.message);
      }

      if (!(response.data as Record<string, unknown>)["getQueryByType"]) {
        throw new Error("Value not found in response");
      }
      return (response.data as Record<string, unknown>)[
        "getQueryByType"
      ] as QueryTypeResponseData[];
    },
  });

  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    // when the notingdata is fetched sort by createdAt and get the first item and set the query text
    if (
      notingdata.isLoading ||
      notingdata.isError ||
      !notingdata.data ||
      notingdata.data.length === 0
    ) {
      const newState = editor.parseEditorState(pretext);
      editor.setEditorState(newState);
      editor.setEditable(true);
      return;
    }
    const text = notingdata.data.sort((a, b) => {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    })[0].query;

    const newState = editor.parseEditorState(text);
    editor.setEditorState(newState);
    editor.setEditable(true);
  }, [notingdata]);

  return <></>;
};

export default LoadState;
