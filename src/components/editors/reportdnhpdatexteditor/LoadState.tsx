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
  const notingdata = useQuery({
      queryKey: ["getQueryByType", id, ["SANAD"]],
      queryFn: async () => {
        const response = await ApiCall({
          query:
            "query GetQueryByType($id: Int!, $querytype: [QueryType!]!) {getQueryByType(id: $id, querytype: $querytype) {id,query,upload_url_1,type,request_type,createdAt,from_user {id, firstName,lastName,role},to_user {id, firstName,lastName,role},}}",
          variables: {
            id: id,
            querytype: ["REPORTDNHPDA"],
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
  const pretext =
    '{"root":{"children":[{"children":[{"children":[{"children":[{"detail":0,"format":1,"mode":"normal","style":"","text":"2.       Report of MSDNHPDA,  (C/    )                                                               Report Date :","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1,"textFormat":1,"textStyle":""}],"direction":"ltr","format":"","indent":0,"type":"tablecell","version":1,"textFormat":1,"backgroundColor":null,"colSpan":6,"headerState":0,"rowSpan":1}],"direction":"ltr","format":"","indent":0,"type":"tablerow","version":1,"textFormat":1},{"children":[{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":" ","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""}],"direction":null,"format":"","indent":0,"type":"tablecell","version":1,"backgroundColor":null,"colSpan":2,"headerState":0,"rowSpan":1},{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Point Submitted","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""}],"direction":"ltr","format":"","indent":0,"type":"tablecell","version":1,"backgroundColor":null,"colSpan":2,"headerState":0,"rowSpan":1},{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Report","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""}],"direction":"ltr","format":"","indent":0,"type":"tablecell","version":1,"backgroundColor":null,"colSpan":1,"headerState":0,"rowSpan":1},{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Remarks","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""}],"direction":"ltr","format":"","indent":0,"type":"tablecell","version":1,"backgroundColor":null,"colSpan":1,"headerState":0,"rowSpan":1}],"direction":"ltr","format":"","indent":0,"type":"tablerow","version":1},{"children":[{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"I.","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""}],"direction":"ltr","format":"","indent":0,"type":"tablecell","version":1,"backgroundColor":null,"colSpan":2,"headerState":0,"rowSpan":1},{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"NA use proposed by the applicant","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""}],"direction":"ltr","format":"","indent":0,"type":"tablecell","version":1,"backgroundColor":null,"colSpan":2,"headerState":0,"rowSpan":1},{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":" ","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""}],"direction":null,"format":"","indent":0,"type":"tablecell","version":1,"backgroundColor":null,"colSpan":1,"headerState":0,"rowSpan":1},{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":" ","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""}],"direction":null,"format":"","indent":0,"type":"tablecell","version":1,"backgroundColor":null,"colSpan":1,"headerState":0,"rowSpan":1}],"direction":"ltr","format":"","indent":0,"type":"tablerow","version":1},{"children":[{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"II.","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""}],"direction":"ltr","format":"","indent":0,"type":"tablecell","version":1,"backgroundColor":null,"colSpan":2,"headerState":0,"rowSpan":1},{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Land use as per Outline Development Plan","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""}],"direction":"ltr","format":"","indent":0,"type":"tablecell","version":1,"backgroundColor":null,"colSpan":2,"headerState":0,"rowSpan":1},{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":" ","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""}],"direction":null,"format":"","indent":0,"type":"tablecell","version":1,"backgroundColor":null,"colSpan":1,"headerState":0,"rowSpan":1},{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":" ","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""}],"direction":null,"format":"","indent":0,"type":"tablecell","version":1,"backgroundColor":null,"colSpan":1,"headerState":0,"rowSpan":1}],"direction":"ltr","format":"","indent":0,"type":"tablerow","version":1},{"children":[{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"III.","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""}],"direction":"ltr","format":"","indent":0,"type":"tablecell","version":1,"backgroundColor":null,"colSpan":2,"headerState":0,"rowSpan":1},{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Whether in Irrigation command Area","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""}],"direction":"ltr","format":"","indent":0,"type":"tablecell","version":1,"backgroundColor":null,"colSpan":2,"headerState":0,"rowSpan":1},{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":" ","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""}],"direction":null,"format":"","indent":0,"type":"tablecell","version":1,"backgroundColor":null,"colSpan":1,"headerState":0,"rowSpan":1},{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":" ","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""}],"direction":null,"format":"","indent":0,"type":"tablecell","version":1,"backgroundColor":null,"colSpan":1,"headerState":0,"rowSpan":1}],"direction":"ltr","format":"","indent":0,"type":"tablerow","version":1},{"children":[{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"IV.","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""}],"direction":"ltr","format":"","indent":0,"type":"tablecell","version":1,"backgroundColor":null,"colSpan":2,"headerState":0,"rowSpan":1},{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Accessibility :","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"1. Direct Accessibility","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"2.Right of Way","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"3.Accessibility from Adjoining land applicant/ Purchaser","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"4.Others","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""}],"direction":"ltr","format":"","indent":0,"type":"tablecell","version":1,"backgroundColor":null,"colSpan":2,"headerState":0,"rowSpan":1},{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":" ","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""}],"direction":null,"format":"","indent":0,"type":"tablecell","version":1,"backgroundColor":null,"colSpan":1,"headerState":0,"rowSpan":1},{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":" ","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""}],"direction":null,"format":"","indent":0,"type":"tablecell","version":1,"backgroundColor":null,"colSpan":1,"headerState":0,"rowSpan":1}],"direction":"ltr","format":"","indent":0,"type":"tablerow","version":1},{"children":[{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"V.","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""}],"direction":"ltr","format":"","indent":0,"type":"tablecell","version":1,"backgroundColor":null,"colSpan":2,"headerState":0,"rowSpan":1},{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Whether area applied has been specified in proposed Map","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""}],"direction":"ltr","format":"","indent":0,"type":"tablecell","version":1,"backgroundColor":null,"colSpan":2,"headerState":0,"rowSpan":1},{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":" ","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""}],"direction":null,"format":"","indent":0,"type":"tablecell","version":1,"backgroundColor":null,"colSpan":1,"headerState":0,"rowSpan":1},{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":" ","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""}],"direction":null,"format":"","indent":0,"type":"tablecell","version":1,"backgroundColor":null,"colSpan":1,"headerState":0,"rowSpan":1}],"direction":"ltr","format":"","indent":0,"type":"tablerow","version":1},{"children":[{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"VI.","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""}],"direction":"ltr","format":"","indent":0,"type":"tablecell","version":1,"backgroundColor":null,"colSpan":2,"headerState":0,"rowSpan":1},{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Any Canal/ Kotar / Road Passing through the land or along the boundary","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""}],"direction":"ltr","format":"","indent":0,"type":"tablecell","version":1,"backgroundColor":null,"colSpan":2,"headerState":0,"rowSpan":1},{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":" ","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""}],"direction":null,"format":"","indent":0,"type":"tablecell","version":1,"backgroundColor":null,"colSpan":1,"headerState":0,"rowSpan":1},{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":" ","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""}],"direction":null,"format":"","indent":0,"type":"tablecell","version":1,"backgroundColor":null,"colSpan":1,"headerState":0,"rowSpan":1}],"direction":"ltr","format":"","indent":0,"type":"tablerow","version":1},{"children":[{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"VII.","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""}],"direction":"ltr","format":"","indent":0,"type":"tablecell","version":1,"backgroundColor":null,"colSpan":2,"headerState":0,"rowSpan":1},{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"Whether the DNHPDA Recommended/Not Recommended the case from the planning point of view?","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""}],"direction":"ltr","format":"","indent":0,"type":"tablecell","version":1,"backgroundColor":null,"colSpan":2,"headerState":0,"rowSpan":1},{"children":[{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":" ","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""}],"direction":null,"format":"","indent":0,"type":"tablecell","version":1,"backgroundColor":null,"colSpan":2,"headerState":0,"rowSpan":1}],"direction":"ltr","format":"","indent":0,"type":"tablerow","version":1}],"direction":"ltr","format":"","indent":0,"type":"root","version":1}}';

  const [editor] = useLexicalComposerContext();

  const createRow = (serial: string, pointText: string) => ({
    children: [
      {
        children: [
          {
            children: [
              {
                detail: 0,
                format: 0,
                mode: "normal",
                style: "",
                text: serial,
                type: "text",
                version: 1,
              },
            ],
            direction: "ltr",
            format: "",
            indent: 0,
            type: "paragraph",
            version: 1,
            textFormat: 0,
            textStyle: "",
          },
        ],
        direction: "ltr",
        format: "",
        indent: 0,
        type: "tablecell",
        version: 1,
        backgroundColor: null,
        colSpan: 2,
        headerState: 0,
        rowSpan: 1,
      },
      {
        children: [
          {
            children: [
              {
                detail: 0,
                format: 0,
                mode: "normal",
                style: "",
                text: pointText,
                type: "text",
                version: 1,
              },
            ],
            direction: "ltr",
            format: "",
            indent: 0,
            type: "paragraph",
            version: 1,
            textFormat: 0,
            textStyle: "",
          },
        ],
        direction: "ltr",
        format: "",
        indent: 0,
        type: "tablecell",
        version: 1,
        backgroundColor: null,
        colSpan: 2,
        headerState: 0,
        rowSpan: 1,
      },
      {
        children: [
          {
            children: [
              {
                detail: 0,
                format: 0,
                mode: "normal",
                style: "",
                text: " ",
                type: "text",
                version: 1,
              },
            ],
            direction: null,
            format: "",
            indent: 0,
            type: "paragraph",
            version: 1,
            textFormat: 0,
            textStyle: "",
          },
        ],
        direction: null,
        format: "",
        indent: 0,
        type: "tablecell",
        version: 1,
        backgroundColor: null,
        colSpan: 2,
        headerState: 0,
        rowSpan: 1,
      },
    ],
    direction: "ltr",
    format: "",
    indent: 0,
    type: "tablerow",
    version: 1,
  });

  useEffect(() => {
    const pretextJson = JSON.parse(pretext) as {
      root: { children: Array<{ children?: unknown[] }> };
    };

    const rows = pretextJson.root.children;
    const hasPoint8 = JSON.stringify(rows).includes(
      "Conditions are to be mentioned in the NA order / Sanad.",
    );
    const hasPoint9 = JSON.stringify(rows).includes(
      "If recommended, Land use Conversion Charge",
    );

    if (!hasPoint8) {
      rows.push(
        createRow(
          "VIII.",
          "Conditions are to be mentioned in the NA order / Sanad.",
        ),
      );
    }

    if (!hasPoint9) {
      rows.push(
        createRow("IX.", "If recommended, Land use Conversion Charge"),
      );
    }
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

    // const newState = editor.parseEditorState(JSON.stringify(pretextJson));
    // editor.setEditorState(newState);
    // editor.setEditable(true);
    // return;
  }, [notingdata]);

  return <></>;
};

export default LoadState;
