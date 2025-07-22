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
  const pretext = `{"root":{"children":[{"children":[{"detail":0,"format":1,"mode":"normal","style":"","text":"INTIMATION ORDER","type":"text","version":1}],"direction":"ltr","format":"center","indent":0,"type":"paragraph","version":1,"textFormat":1,"textStyle":""},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"        To, ","type":"text","version":1}],"direction":"ltr","format":"left","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"${
    na_data.data!.q4
  } - ${
    na_data.data!.last_name
  }","type":"text","version":1}],"direction":"ltr","format":"left","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"        R/o. village Naroli.","type":"text","version":1}],"direction":"ltr","format":"left","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"        (Through: - Talathi, Naroli).","type":"text","version":1}],"direction":"ltr","format":"left","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""},{"children":[],"direction":null,"format":"left","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"        Subject: - Grant of N.A. use permission in respect of land bearing survey No. ${na_data.data!.q7} (old srv no. ${na_data.data!.q10}) area admeasuring ${na_data.data!.q9} HA/Are. Out of ${na_data.data!.q11} HA/Are of Village ${na_data.data!.village?.name} for ${na_data.data!.q12} Purpose.","type":"text","version":1}],"direction":"ltr","format":"left","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""},{"children":[],"direction":"ltr","format":"left","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"        Reference: - Notice No. ADA/Coll. /Misc. 2016/171 dated 08/07/2016 of the Collector, DNH, Silvassa.","type":"text","version":1}],"direction":"ltr","format":"left","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"        Sir,","type":"text","version":1}],"direction":"ltr","format":"left","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"        With reference to the subject and reference mentioned above, I am directed to state that the Hon’ble Collector, DNH, Silvassa has granted of N.A. use permission in respect of land bearing survey No. ${na_data.data!.q7} (old srv no. ${na_data.data!.q10}) area admeasuring ${na_data.data!.q9} HA/Are. Out of ${na_data.data!.q11} HA/Are of Village ${na_data.data!.village?.name} for ${na_data.data!.q12} Purpose.","type":"text","version":1}],"direction":"ltr","format":"left","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"        Before issuance of the Sanad granting N.A. use permission, the amount shown below is required to be paid. ","type":"text","version":1}],"direction":"ltr","format":"left","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"        1. Rs. 40,080/- (Rupees  Fourty Thousand  Eighty Only)  being  the  land  use conversion charges as per Letter No.DNHPDA/ NA/SrvNo.3233/Naroli/50/2025/ 589, dated: 19/05/2025 to the Member Secretary, DNHPDA, Silvassa.","type":"text","version":1}],"direction":"ltr","format":"left","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"        2.  Rs. 7,014/- (Rupees Seven Thousand Fourteen Only) towards the charge of execution of Damanganga Irrigation Project.","type":"text","version":1}],"direction":"ltr","format":"left","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"        In respect of point of point No.1 the said amount may be paid to MSDNHPDA, Silvassa and point No.2 the same may be paid through the Treasury Challan to be obtained from Mamlatdar, Silvassa.","type":"text","version":1}],"direction":"ltr","format":"left","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"        After making payment of aforementioned charges, the holder shall execute the Sanad granting N.A. use permission in prescribed Form No. VIII within a period of 30 days from the date of issue of this letter, failing which the N.A. use permission granted shall be deemed to be cancelled. The Sanad should invariably contain terms and conditions as per Annexure enclosed.","type":"text","version":1}],"direction":"ltr","format":"left","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"        No mutation entry indicating the land as an N.A. land shall be carried out unless the Sanad is granted by Hon’ble Collector, DNH, Silvassa.","type":"text","version":1}],"direction":"ltr","format":"left","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""},{"children":[],"direction":null,"format":"left","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""},{"children":[],"direction":null,"format":"left","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""},{"children":[],"direction":"ltr","format":"left","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""},{"children":[{"detail":0,"format":9,"mode":"normal","style":"","text":"ANNEXURE","type":"text","version":1}],"direction":"ltr","format":"center","indent":0,"type":"paragraph","version":1,"textFormat":9,"textStyle":""},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":" ","type":"text","version":1}],"direction":null,"format":"left","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"       1. The permission is granted subject to the provisions of Dadra and Nagar Haveli Land Revenue Administration Regulation, 1971 and the rules made there under.","type":"text","version":1}],"direction":"ltr","format":"left","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"       2. The holder shall commence Non-agricultural use within a period of five years from the date of issue of this letter, failing which, unless the said period is extended by the Collector from time to time, the permission granted shall be deemed to be lapsed.","type":"text","version":1}],"direction":"ltr","format":"left","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"        3. The holder shall pay non-agriculture assessment at the rate of Rs.0.02 paise per sq. mtrs per annum.","type":"text","version":1}],"direction":"ltr","format":"left","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"        4. The holder shall abide by other reasonable condition or conditions which the Collector may deemed fit to impose having regard to use of the land at any time.","type":"text","version":1}],"direction":"ltr","format":"left","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"        5. No tree standing on the land shall be allowed to be cut without the prior permission of the competent authority.","type":"text","version":1}],"direction":"ltr","format":"left","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"        6. The land shall not be allowed to be used for the purpose other than that for which the permission is granted. The land use is permitted for N.A. Residential-cum Commercial Purpose Only.","type":"text","version":1}],"direction":"ltr","format":"left","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"        7. The landholder shall obtain construction permission and shall get the building plans prepared as per the norms/rules of the Development Control Rules, and get them approved from the competent authority prior to carrying out any construction work on the site.","type":"text","version":1}],"direction":"ltr","format":"left","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"        8. The holder shall apply separately for access through roadside protected forests.","type":"text","version":1}],"direction":"ltr","format":"left","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"        9. No overhead transmission line will be permitted and land holder will have to lay underground cables at their own cost.","type":"text","version":1}],"direction":"ltr","format":"left","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"        10. The holder concerned shall make his own arrangement for water supply. There is no guarantee whatsoever for power supply.","type":"text","version":1}],"direction":"ltr","format":"left","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"        11. Before commencement of NA use the land holder shall obtain clearance from Department of Environment & Forest to ensure that land does not fall within the buffer zone of Reserved Forests/Wildlife Sanctuary. The failure to obtain the said clearance shall make the NA permission void.","type":"text","version":1}],"direction":"ltr","format":"left","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"        12. This order is without prejudice to any court case, status of land or order etc, which has not been brought on record by the date of passing of this order.","type":"text","version":1}],"direction":"ltr","format":"left","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"        13. The landholder shall ensure that the natural water flow, if passing through the subject land may not be obstructed.","type":"text","version":1}],"direction":"ltr","format":"left","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"        14. The land holder shall make necessary arrangement for disposal of Solid/Liquid waste and ensure that no such waste shall be littered in surrounding areas and that it shall be dumped in designated area identified for dumping the garbage, failing which action shall be initiated for creating public nuisance under the relevant provision of Bhartiya Nagrik Suraksha Sanhita 2023 and other corresponding law apart from cancelling the NA permission without compensation for the building standing thereon.","type":"text","version":1}],"direction":"ltr","format":"left","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"        15. The land holder shall set up Sewerage Treatment plant of the adequate size in the complex and shall set up water treatment plant in the complex.","type":"text","version":1}],"direction":"ltr","format":"left","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"        16. In case of construction of multi-storeyed complex having more than 30 DVS. The land holder shall set up Sewerage Treatment Plant of the adequate size in the complex and recycle the water for gardening and other clearing purpose.","type":"text","version":1}],"direction":"ltr","format":"left","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"        17.  The waste water shall not be discharged in neighbouring areas of others.","type":"text","version":1}],"direction":"ltr","format":"left","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"        18.  The land holder shall ensure that adequate drinking water supply is available for the complex and shall set up Water Treatment Plant in the complex.","type":"text","version":1}],"direction":"ltr","format":"left","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"        19. In case the documents/information given by the applicants turnout to be false or the information is found to be suppressed the NA permission granted shall be deemed to be cancelled. ","type":"text","version":1}],"direction":"ltr","format":"left","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"        20.  The proposed land is out of Wild Life Eco Sensitive Zone as per Notification dated 04/09/2015.    ","type":"text","version":1}],"direction":"ltr","format":"left","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"        21. The  said  land  is  under Development Zone-ll as  per  the  Revised  Outline Development Plan and as per the zoning regulations stipulated under General Development Rules 2023, the proposed Residential-cum-Commercial activity is permitted from planning point of view. Hence, the said land bearing Sr. No. 3233 (Old Srv.No. 746/4) area admeasuring 1002 Sq.mt is recommended for NA Residential-cum-Commercial Purpose.","type":"text","version":1}],"direction":"ltr","format":"left","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"        22. The development activities shall be permitted on the said land shall be as per the General Development Rules 2023 of DNH and any other rules / orders notified from time to time.","type":"text","version":1}],"direction":"ltr","format":"left","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"        23.  Proper drainage facilities and other mandatory infrastructure facilities has to be provided.","type":"text","version":1}],"direction":"ltr","format":"left","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"        24.  The structure existing (if any) on the said land shall be demolished or to be regularized as per GDR as soon as NA is obtained.","type":"text","version":1}],"direction":"ltr","format":"left","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"        25.  The applicant shall require to maintain roadside margin of 19.50 mt from centre of the 25.00 mtr ODP road.","type":"text","version":1}],"direction":"ltr","format":"left","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"        26.  The applicant has to maintain adequate distance of the building from the HT/LT lines as per Rule 20.1.1 of GDR,2023 before obtaining Construction Permission.","type":"text","version":1}],"direction":"ltr","format":"left","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"        27.  The applicant shall not commence any development activity without the approval of the Competent Authority.","type":"text","version":1}],"direction":"ltr","format":"left","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""},{"children":[{"detail":0,"format":0,"mode":"normal","style":"","text":"In the event of breach of any of the above conditions, the NA use permission granted shall be deemed to have been cancelled and the construction so carried out shall be liable to be removed at the risk and cost of the party concerned.","type":"text","version":1}],"direction":"ltr","format":"left","indent":0,"type":"paragraph","version":1,"textFormat":0,"textStyle":""}],"direction":"ltr","format":"","indent":0,"type":"root","version":1}}`;
  const notingdata = useQuery({
    queryKey: ["getQueryByType", id, ["INTIMATION_DRAFT"]],
    queryFn: async () => {
      const response = await ApiCall({
        query:
          "query GetQueryByType($id: Int!, $querytype: [QueryType!]!) {getQueryByType(id: $id, querytype: $querytype) {id,query,upload_url_1,type,request_type,createdAt,from_user {id, firstName,lastName,role},to_user {id, firstName,lastName,role},}}",
        variables: {
          id: id,
          querytype: ["INTIMATION_DRAFT"],
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
