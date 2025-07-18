"use client";
import { ApiCall } from "@/services/api";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

interface LoadStateProps {
  id: number;
  isAccepted: boolean;
  isRejected: boolean;
  isRescheduled: boolean;
  users: string[];
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

const LoadState = ({
  id,
  isAccepted,
  isRejected,
  isRescheduled,
  users,
}: LoadStateProps) => {
  const formdata = useQuery({
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
  // {"children":[{"detail":0,"format":1,"mode":"normal","style":"","text":"        ","type":"text","version":1},{"detail":0,"format":0,"mode":"normal","style":"","text":"2. Colector","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1,"textFormat":1,"textStyle":""}

  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    // Don't proceed if form data is not loaded yet
    if (!formdata.data) {
      return;
    }

    // Construct usersnotetext inside useEffect so it updates when users change
    let usersnotetext = "";
    let userCount = 1;
    for (const user of users) {
      if (usersnotetext !== "") {
        usersnotetext += ",";
      }
      usersnotetext += `{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"       ${userCount}. ${user}","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""}`;
      userCount++;
    }

    // Construct pretext inside useEffect so it updates when users or formdata change
    const now = new Date();
    const formattedDate = now.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    const formattedTime = now.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    const currentYear = new Date().getFullYear();
    const pretext = `{"root":{"children":[{"children":[{"detail":0,"format":1,"mode":"normal","style":"","text":"MAM/Silvassa(${
      formdata.data?.id
    })/NA/${currentYear} ZIMNI","type":"text","version":1}],"direction":"ltr","format":"center","indent":0,"type":"heading","version":1,"textFormat":1,"tag":"h1"},{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""},{"children":[{"detail":0,"format":1,"mode":"normal","style":"","text":"PRESENT PARTIES held at ${formattedDate} @ ${formattedTime}","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1,"textFormat":1,"textStyle":""},{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1,"textFormat":1,"textStyle":""}${
      usersnotetext ? "," + usersnotetext : ""
    },{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""},{"children":[],"direction":null,"format":"","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""},{"children":[{"detail":0,"format":1,"mode":"normal","style":"","text":"Heard. ","type":"text","version":1},{"detail":0,"format":0,"mode":"normal","style":"","text":"${
      isRescheduled
        ? "The Hon'ble collector has decided to reschedule the hearing."
        : `Applicants have requested for NA Permission of land bearing survey No.${
            formdata.data?.q7
          } (old srv no. ${formdata.data?.q10}) area admeasuring ${
            formdata.data?.q9
          } HA/Are. Out of ${formdata.data?.q11} HA/Are of Village ${
            formdata.data?.village?.name
          } for ${
            formdata.data?.q12
          } Purpose. Public notice has already been given. Report from LRO, LAQ, DNHPDA and TALATHI has been received, and the NA documentation of the application was found in order. No Objection has been received. Applicants, who are present before me, have shown their willingness for NA Permission of land. There request is hereby ","type":"text","version":1},{"detail":0,"format":1,"mode":"normal","style":"","text":"${
            isAccepted ? "Approved" : "Rejected"
          }","type":"text","version":1},{"detail":0,"format":0,"mode":"normal","style":"","text":". ${
            isAccepted ? "Order be prepared accordingly." : ""
          } `
    } ","type":"text","version":1}],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1,"textFormat":1,"textStyle":""},{"children":[],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""},{"children":[],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""},{"children":[],"direction":"ltr","format":"","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""}],"direction":"ltr","format":"","indent":0,"type":"root","version":1,"textFormat":1}}`;

    const newState = editor.parseEditorState(pretext);
    editor.setEditorState(newState);
    editor.setEditable(true);
  }, [formdata.data, editor, users, isAccepted]);

  return <></>;
};

export default LoadState;
