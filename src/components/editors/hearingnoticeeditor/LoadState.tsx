"use client";
import { ApiCall } from "@/services/api";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";

interface LoadStateProps {
  id: number;
}

interface NaFormResponse {
  id: number;
  last_name: string;
  dept_status: string;
  q1: boolean;
  q2: string;
  q3: string;
  anx1: string;
  anx2: string;
  anx3: string;
  anx4: string;
  anx5: string;
  q4: string;
  q5: string;
  q6: string;
  q7: string;
  q8: string;
  q9: string;
  q10: string;
  q11: string;
  q12: string;
  q13: string;
  q14: string;
  q15: string;
  q16: string;
  q17: string;
  q18: string;
  createdById: number;
  createdAt: string;
  village: {
    id: number;
    name: string;
  };
  na_applicant: {
    firstName: string;
    lastName: string;
    contact: string;
    relation: string;
    signature_url: string;
  }[];
  na_survey: {
    area: string;
    sub_division: string;
    survey_no: string;
    village: {
      name: string;
    };
  }[];
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
  const na_data = useQuery({
    queryKey: ["getnaform", id],
    queryFn: async () => {
      const response = await ApiCall({
        query:
          "query GetNaById($id:Int!) { getNaById(id: $id) { id, dept_status, last_name, q1, q2, q3, q4, anx1, anx2, anx3, anx4, anx5, q4, q5, q6, q7, q8, q9, q10, q11, q12, q13, q14, q15, q16, q17, q18, createdById, createdAt, village{ id, name }, na_applicant { firstName, lastName, contact,relation, signature_url }, na_survey { area, sub_division, survey_no, village { name }}}}",
        variables: {
          id: id,
        },
      });

      if (!response.status) {
        throw new Error(response.message);
      }

      if (!(response.data as Record<string, unknown>)["getNaById"]) {
        throw new Error("Value not found in response");
      }
      return (response.data as Record<string, unknown>)[
        "getNaById"
      ] as NaFormResponse;
    },
  });
  const pretext = `{"root":{"children":[{"children":[{"detail":0,"format":1,"mode":"normal","style":"","text":"NOTICE","type":"text","version":1}],"direction":"ltr","format":"center","indent":0,"type":"paragraph","version":1,"textFormat":1,"textStyle":""},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":" ","type":"text","version":1}],"direction":null,"format":"","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"        To,","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"        1. ${
    na_data.data!.q4
  } - ${
    na_data.data!.last_name
  }","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"        (Through Talathi - Naroli)","type":"text","version":1}],"direction":"ltr","format":"justify","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"        Subject- Grant of NA use permission in respect of land bearing survey No. ${
    na_data.data!.q7
  } (old srv no. ${na_data.data!.q10}) area admeasuring ${
    na_data.data!.q9
  } HA/Are. Out of ${na_data.data!.q11} HA/Are of Village ${
    na_data.data!.village?.name
  } for ${
    na_data.data!.q12
  } Purpose.","type":"text","version":1}],"direction":"ltr","format":"justify","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"        Sir / Madam,","type":"text","version":1}],"direction":"ltr","format":"justify","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"       I am directed to inform you that Hon’ble Collector, DNH, Silvassa has fixed hearing in the above matter on ","type":"text","version":1},{"detail":0,"format":9,"mode":"normal","style":"","text":"05/ 03/ 2025 (Wednesday","type":"text","version":1},{"detail":0,"format":1,"mode":"normal","style":"","text":") ","type":"text","version":1},{"detail":0,"format":0,"mode":"normal","style":"","text":"at ","type":"text","version":1},{"detail":0,"format":1,"mode":"normal","style":"","text":"11.00 (A.M. / ","type":"text","version":1},{"detail":0,"format":0,"mode":"normal","style":"","text":"P.M.) in his chamber at Silvassa.","type":"text","version":1}],"direction":"ltr","format":"justify","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"        You are requested to appear before the Hon’ble Collector on the date and time mentioned above. A passport size photograph and photo identity may also be produced during the hearing.","type":"text","version":1}],"direction":"ltr","format":"justify","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"        ","type":"text","version":1},{"detail":0,"format":8,"mode":"normal","style":"","text":"Note:-","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"        The Applicant (s) ","type":"text","version":1},{"detail":0,"format":2,"mode":"normal","style":"","text":"I","type":"text","version":1},{"detail":0,"format":0,"mode":"normal","style":"","text":" Purchaser (s) with all legal heirs have to personally appear for the said hearing. Authority Letter/Power of Attorney shall not be considered.","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"        Copy to:","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"        1. The P.A. to Collector, DNH, Silvassa for information please.","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""}],"direction":"ltr","format":"","indent":0,"type":"root","version":1}}`;

  const notingdata = useQuery({
    queryKey: ["getQueryByType", id, ["HEARING_NOTICE"]],
    queryFn: async () => {
      const response = await ApiCall({
        query:
          "query GetQueryByType($id: Int!, $querytype: [QueryType!]!) {getQueryByType(id: $id, querytype: $querytype) {id,query,upload_url_1,type,request_type,createdAt,from_user {id, firstName,lastName,role},to_user {id, firstName,lastName,role},}}",
        variables: {
          id: id,
          querytype: ["HEARING_NOTICE"],
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
