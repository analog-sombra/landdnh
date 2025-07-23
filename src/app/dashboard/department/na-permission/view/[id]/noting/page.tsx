"use client";
import { Collapse, Popover, Tabs } from "antd";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  decryptURLData,
  formatDateTime,
  formateDate,
  roleToString,
} from "@/utils/methods";
import { ApiCall } from "@/services/api";
import { useMutation, useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { baseurl } from "@/utils/const";
import { Alert } from "antd";
import { getCookie } from "cookies-next/client";
import { IcBaselineArrowBack } from "@/components/icons";
import { NotingEditor } from "@/components/editors/notingtexteditor/page";
import { ViewEditor } from "@/components/editors/vieweditro/page";
import { toast } from "react-toastify";
import { queryStatus } from "@/utils/utilscompoment";
import { HearingNoticeEditor } from "@/components/editors/hearingnoticeeditor/page";
import { SanadGenerateEditor } from "@/components/editors/sanadgenerateeditor/page";
import { IntimationOrderEditor } from "@/components/editors/intimationordereditor/page";
import { ShowEditor, UserChat } from "@/components/chat";

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

const Meeting = () => {
  const [isNoting, setIsNoting] = useState<boolean>(false);
  const [isSanad, setIsSanad] = useState<boolean>(false);
  const [isHearing, setIsHearing] = useState<boolean>(false);
  const [isIntimation, setIsIntimation] = useState<boolean>(false);
  const userid = getCookie("id");

  const router = useRouter();

  const { id } = useParams<{ id: string | string[] }>();
  const idString = Array.isArray(id) ? id[0] : id;
  const formid: number = parseInt(decryptURLData(idString, router));
  const onChange = (key: string) => {
    setIsNoting(false);
    setIsHearing(false);
    setIsSanad(false);
    setIsIntimation(false);
    console.log(key);
  };

  const formdata = useQuery({
    queryKey: ["getnaform", formid],
    queryFn: async () => {
      const response = await ApiCall({
        query:
          "query GetNaById($id:Int!) { getNaById(id: $id) { id, dept_status, last_name, q1, q2, q3, q4, anx1, anx2, anx3, anx4, anx5, q4, q5, q6, q7, q8, q9, q10, q11, q12, q13, q14, q15, q16, q17, q18, createdById, createdAt, village{ id, name }, na_applicant { firstName, lastName, contact,relation, signature_url }, na_survey { area, sub_division, survey_no, village { name }}}}",
        variables: {
          id: formid,
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

  interface UserResponse {
    id: number;
    firstName: string;
    lastName: string;
    role: string;
  }

  const userdata = useQuery({
    queryKey: ["naform"],
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const response = await ApiCall({
        query:
          "query GetUserById($id: Int!) { getUserById(id: $id) {id, firstName, lastName, role}}",
        variables: {
          id: parseInt(userid!.toString()),
        },
      });

      if (!response.status) {
        throw new Error(response.message);
      }

      // if value is not in response.data then return the error
      if (!(response.data as Record<string, unknown>)["getUserById"]) {
        throw new Error("Value not found in response");
      }
      return (response.data as Record<string, unknown>)[
        "getUserById"
      ] as UserResponse;
    },
  });

  interface NAResponseData {
    id: number;
  }

  const updatenadata = useMutation({
    mutationKey: ["updateNa"],
    mutationFn: async () => {
      if (!userid) {
        toast.error("User ID not found");
        return;
      }

      const response = await ApiCall({
        query:
          "mutation UpdateNa($updateNaInput: UpdateNaInput!) {updateNa(updateNaInput: $updateNaInput) {id}}",
        variables: {
          updateNaInput: {
            id: formid,
            dept_status: "NOTING_DRAFT",
          },
        },
      });

      if (!response.status) {
        throw new Error(response.message);
      }

      if (!(response.data as Record<string, unknown>)["updateNa"]) {
        throw new Error("Value not found in response");
      }
      return (response.data as Record<string, unknown>)[
        "updateNa"
      ] as NAResponseData;
    },
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: () => {
      toast.success("Noting Updated Successfully");
    },
  });

  const data = [
    {
      key: "1",
      label: "Defendant information",
      children: (
        <div className="p-1 grid grid-cols-4 gap-6 justify-between">
          <div>
            <p className="text-sm">Form Type</p>
            <p className="text-sm  font-medium">Non-Agricultural Permission</p>
          </div>
          <div>
            <p className="text-sm">Date of application</p>
            <p className="text-sm  font-medium">
              {formateDate(new Date(formdata.data?.createdAt || ""))}
            </p>
          </div>
          <div>
            <p className="text-sm">Name of applicant</p>
            <p className="text-sm  font-medium">
              {formdata.data?.na_applicant[0].firstName}{" "}
              {formdata.data?.na_applicant[0].lastName}
            </p>
          </div>

          <div>
            <p className="text-sm">Contact</p>
            <p className="text-sm  font-medium">{formdata.data?.q6}</p>
          </div>

          <div>
            <p className="text-sm">Occupation</p>
            <p className="text-sm  font-medium">{formdata.data?.q13}</p>
          </div>
          <div className="col-span-3">
            <p className="text-sm">Address</p>
            <p className="text-sm  font-medium">{formdata.data?.q5}</p>
          </div>
        </div>
      ),
    },
    {
      key: "2",
      label: "Cases on the docket",
      children: (
        <div className="p-1 grid grid-cols-4 gap-6 justify-between">
          <div>
            <p className="text-sm">NA Type</p>
            <p className="text-sm  font-medium">{formdata.data?.q12}</p>
          </div>
          <div>
            <p className="text-sm">Village</p>
            <p className="text-sm  font-medium">
              {formdata.data?.village.name}
            </p>
          </div>
          <div>
            <p className="text-sm">Survey No</p>
            <p className="text-sm  font-medium">
              {formdata.data?.q7}-{formdata.data?.q8}
            </p>
          </div>

          <div>
            <p className="text-sm">Plot Area</p>
            <p className="text-sm  font-medium">{formdata.data?.q9}</p>
          </div>
          <div>
            <p className="text-sm">No of Applicant</p>
            <p className="text-sm  font-medium">
              {formdata.data?.na_applicant.length}
            </p>
          </div>

          <div>
            <p className="text-sm">No of survey no</p>
            <p className="text-sm  font-medium">
              {formdata.data?.na_survey.length}
            </p>
          </div>
        </div>
      ),
    },
  ];

  const items = [
    {
      key: "1",
      label: "Case Information",
      children: (
        <>
          <div className="flex items-center mb-4">
            <div className="bg-blue-500 grid place-items-center text-lg rounded-full h-10 w-10 text-white font-semibold">
              {formdata.data?.na_applicant[0].firstName.charAt(0).toUpperCase()}
            </div>
            <div className="ml-4">
              <p className="text-lg">
                {formdata.data?.na_applicant[0].firstName}{" "}
                {formdata.data?.na_applicant[0].lastName}
              </p>
              <p className="text-gray-700 text-sm">
                Non-Agricultural Permission
              </p>
            </div>
          </div>
          <Collapse items={data} defaultActiveKey={["1", "2"]} />
        </>
      ),
    },
    {
      key: "2",
      label: "Form",
      children: formdata.data ? (
        <>
          <div className="bg-white">
            <h1 className="mx-4 text-lg text-center font-semibold mt-4">
              F O R M - V I I
            </h1>
            <h1 className="text-lg text-center font-semibold leading-3">
              (See Rule 46)
            </h1>
            <p className="mx-4 text-xs text-left mt-2">
              Form of application under Sub-section (1) of Section 42 of the
              Dadra and Nagar Haveli. Land Revenue Administration Regulation,
              1971.
            </p>
            <p className="mx-4 text-xs text-left mt-4">To,</p>
            <p className="mx-4 text-xs text-left">The Collector,</p>
            <p className="mx-4 text-xs text-left">Dadra and Nager Haveli,</p>
            <p className="mx-4 text-xs text-left">Silvassa, DNH & DD</p>
            <h1 className="mx-4 text-sm text-center font-semibold underline">
              SUBJECT : Application for grant of permission for NA OF LAND
            </h1>
            <p className="mx-4 text-xs text-left">Sir,</p>

            <p className="mx-4 text-xs text-left">
              We, the undersigned hereby apply for grant of permission for{" "}
              <span className="font-semibold">NA OF LAND</span> for which
              details are given below :-
            </p>
            <div className="bg-gray-100 px-4 py-1 my-2 mx-4 text-sm">
              Applicant Details
            </div>

            <div className="flex gap-8 border-b border-gray-200 pb-2 mb-2 px-16">
              <p className="flex-1 text-sm text-gray-500">
                (a) Assessed or held for the purpose of agriculture/for the
                non-agriculture purpose /purpose of.
              </p>
              <div className="flex-1">{formdata.data!.q1 ? "Yes" : "No"}</div>
            </div>

            <div className="flex gap-8 border-b border-gray-200 pb-2 mb-2 px-16">
              <p className="flex-1 text-sm text-gray-500">
                (b) Assessed or held for the non-agriculture purpose of
              </p>
              <div className="flex-1">{formdata.data!.q2}</div>
            </div>

            <div className="flex gap-8 border-b border-gray-200 pb-2 mb-2 px-16">
              <p className="flex-1 text-sm text-gray-500">
                (c) Assessed or held for the non-agriculture purpose but in
                relaxation of condition on the time of grant of land or
                permission for such non-agricultural use Viz
              </p>
              <div className="flex-1">{formdata.data!.q3}</div>
            </div>

            <div className="bg-gray-100 px-4 py-1 my-2 mx-4 text-sm">
              Annexure Details
            </div>
            <div className="flex gap-8 border-b border-gray-200 pb-2 mb-2 px-16">
              <div>
                <p className="text-sm text-gray-700">
                  Annexure 1: A certified copy of record of rights in respect of
                  rights in respect of the land as existed at right the time of
                  application.
                  <span className="text-red-500">
                    (to be attached in form of pdf)
                  </span>
                </p>
                <p className="ml-4">1. 7x12 Extract</p>
                <p className="ml-4">2. V.F No.6</p>
                <p className="ml-4">3. V.F No.8-A</p>
                <p className="ml-4">4. Adesh granting occupancy rights.</p>
              </div>
              <div className="grow"></div>

              <Link
                target="_blank"
                href={`${baseurl}/${formdata.data!.anx1}`}
                className="shrink-0 bg-gray-200 text-black py-1 px-4 rounded-md text-sm h-8 grid place-items-center"
              >
                View File
              </Link>
            </div>
            <div className="flex gap-8 border-b border-gray-200 pb-2 mb-2 px-16">
              <div>
                <p className="text-sm text-gray-700">
                  Annexure 2: A sketch or layout of the site in question (in
                  triplicate) showing the location of the proposed building or
                  other works for which permission is sought and the nearest
                  roads or means or access.
                </p>
                <p className="ml-4">1. Certified Site Plan</p>
                <p className="ml-4">2. NA Proposal Plan</p>
              </div>
              <div className="grow"></div>

              <Link
                target="_blank"
                href={`${baseurl}/${formdata.data!.anx2}`}
                className="shrink-0 bg-gray-200 text-black py-1 px-4 rounded-md text-sm h-8 grid place-items-center"
              >
                View File
              </Link>
            </div>
            <div className="flex gap-8 border-b border-gray-200 pb-2 mb-2 px-16">
              <p className="text-sm text-gray-700">
                Annexure 3: Written consent of the tenant/ occupant.
              </p>
              <div className="grow"></div>

              <Link
                target="_blank"
                href={`${baseurl}/${formdata.data!.anx3}`}
                className="bg-gray-200 text-black py-1 px-4 rounded-md text-sm h-8 grid place-items-center"
              >
                View File
              </Link>
            </div>
            <div className="flex gap-8 border-b border-gray-200 pb-2 mb-2 px-16">
              <p className="text-sm text-gray-700">
                Annexure 4: Other Document
              </p>
              <div className="grow"></div>
              <Link
                target="_blank"
                href={`${baseurl}/${formdata.data!.anx4}`}
                className="bg-gray-200 text-black py-1 px-4 rounded-md text-sm h-8 grid place-items-center"
              >
                View File
              </Link>
            </div>
            <div className="flex gap-8 border-b border-gray-200 pb-2 mb-2 px-16">
              <p className="text-sm text-gray-700">
                Annexure 5: Other Document
              </p>

              <div className="grow"></div>

              <Link
                target="_blank"
                href={`${baseurl}/${formdata.data!.anx5}`}
                className="bg-gray-200 text-black py-1 px-4 rounded-md text-sm h-8 grid place-items-center"
              >
                View File
              </Link>
            </div>
            <div className="bg-gray-100 px-4 py-1 my-2 mx-4 text-sm">
              Also furnish the following information
            </div>

            <div className="flex gap-8 border-b border-gray-200 pb-2 mb-2 px-16">
              <p className="flex-1 text-sm text-gray-500">
                (1). First Name of the Applicant.
              </p>
              <div className="flex-1">{formdata.data!.q4}</div>
            </div>

            <div className="flex gap-8 border-b border-gray-200 pb-2 mb-2 px-16">
              <p className="flex-1 text-sm text-gray-500">
                (2). Last Name of the Applicant.
              </p>
              <div className="flex-1">{formdata.data!.last_name}</div>
            </div>

            <div className="flex gap-8 border-b border-gray-200 pb-2 mb-2 px-16">
              <p className="flex-1 text-sm text-gray-500">
                (3). Full Postal Address.
              </p>
              <div className="flex-1">{formdata.data!.q5}</div>
            </div>
            <div className="flex gap-8 border-b border-gray-200 pb-2 mb-2 px-16">
              <p className="flex-1 text-sm text-gray-500">
                (4). Contact no of the applicant.
              </p>
              <div className="flex-1">{formdata.data!.q6}</div>
            </div>
            <h1 className="bg-gray-100 px-4 py-1 my-2 mx-4 text-sm">
              Additonal Applicant Details
            </h1>

            <div className="overflow-x-auto mx-16 border-b border-gray-200 pb-2 mb-2">
              <table className="table-auto w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-4 py-2 font-normal text-sm whitespace-nowrap">
                      First Name
                    </th>
                    <th className="border border-gray-300 px-4 py-2 font-normal text-sm whitespace-nowrap">
                      Last Name
                    </th>
                    <th className="border border-gray-300 px-4 py-2 font-normal text-sm">
                      Contact
                    </th>
                    <th className="border border-gray-300 px-4 py-2 font-normal text-sm">
                      Relation
                    </th>
                    <th className="border border-gray-300 px-4 py-2 font-normal text-sm w-52">
                      Signature
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {formdata.data!.na_applicant.map((field, index) => (
                    <tr key={index}>
                      <td className="border border-gray-300 p-1">
                        <p>{field.firstName}</p>
                      </td>
                      <td className="border border-gray-300 p-1">
                        <p>{field.lastName}</p>
                      </td>
                      <td className="border border-gray-300 p-1">
                        <p>{field.contact}</p>
                      </td>
                      <td className="border border-gray-300 p-1">
                        <p>{field.relation}</p>
                      </td>
                      <td className="border border-gray-300 p-1 flex gap-2 items-center">
                        <Link
                          target="_blank"
                          href={`${baseurl}/${field.signature_url}`}
                          className="bg-gray-200 text-black py-1 px-1 rounded-md text-sm h-8 grid place-items-center"
                        >
                          View Signature
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex gap-8 border-b border-gray-200 pb-2 mb-2 px-16 ">
              <p className="flex-1 text-sm text-gray-500">(5) Village</p>
              <div className="flex-1">{formdata.data!.village.name}</div>
            </div>
            <div className="flex gap-8 border-b border-gray-200 pb-2 mb-2 px-16">
              <p className="flex-1 text-sm text-gray-500">(6) Survey No</p>
              <div className="flex-1">{formdata.data!.q7}</div>
            </div>
            <div className="flex gap-8 border-b border-gray-200 pb-2 mb-2 px-16">
              <p className="flex-1 text-sm text-gray-500">(7) Sub Division</p>
              <div className="flex-1">{formdata.data!.q8}</div>
            </div>

            <div className="flex gap-8 border-b border-gray-200 pb-2 mb-2 px-16">
              <p className="flex-1 text-sm text-gray-500">(8) Area in Sq.mt.</p>
              <div className="flex-1">{formdata.data!.q9}</div>
            </div>
            <div className="flex gap-8 border-b border-gray-200 pb-2 mb-2 px-16">
              <p className="flex-1 text-sm text-gray-500">(9) Old Survey No</p>
              <div className="flex-1">{formdata.data!.q10}</div>
            </div>

            <h1 className="bg-gray-100 px-4 py-1 my-2 mx-4 text-sm">
              Survey Details
            </h1>
            <div className="overflow-x-auto px-16 border-b border-gray-200 pb-2 mb-2">
              <table className="table-auto w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border border-gray-300 px-4 py-2 font-normal text-sm">
                      Survey No
                    </th>
                    <th className="border border-gray-300 px-4 py-2 font-normal text-sm">
                      Area in Sq.mt.
                    </th>
                    <th className="border border-gray-300 px-4 py-2 font-normal text-sm">
                      Sub Division
                    </th>
                    <th className="border border-gray-300 px-4 py-2 font-normal text-sm w-40">
                      Village
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {formdata.data!.na_survey.map((field, index) => (
                    <tr key={index}>
                      <td className="border border-gray-300 px-4 py-2">
                        <p>{field.survey_no}</p>
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        <p>{field.area} Sq.mt.</p>
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        <p>{field.sub_division}</p>
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        <p>{field.village.name}</p>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="flex gap-8 border-b border-gray-200 pb-2 mb-2 px-16">
              <p className="flex-1 text-sm text-gray-500">
                (10) Area of the site out of (6) above to be used for.
              </p>
              <div className="flex-1">{formdata.data!.q11}</div>
            </div>
            <div className="flex gap-8 border-b border-gray-200 pb-2 mb-2 px-16">
              <p className="flex-1 text-sm text-gray-500">
                (11) Type (Residential/Commercial/Industrial)
              </p>
              <div className="flex-1">{formdata.data!.q12}</div>
            </div>
            <div className="flex gap-8 border-b border-gray-200 pb-2 mb-2 px-16">
              <p className="flex-1 text-sm text-gray-500">
                (12) Present use of the land and whether any building exists
                thereon and if so, it's use.
              </p>
              <div className="flex-1">{formdata.data!.q13}</div>
            </div>
            <div className="flex gap-8 border-b border-gray-200 pb-2 mb-2 px-16">
              <p className="flex-1 text-sm text-gray-500">
                (13) Whether electrical light transmission lines pass over tle
                land and if so, the distance thereof from the proposed building
                other works.
              </p>
              <div className="flex-1">{formdata.data!.q14}</div>
            </div>
            <div className="flex gap-8 border-b border-gray-200 pb-2 mb-2 px-16">
              <p className="flex-1 text-sm text-gray-500">
                (14) Is, the land under acquisition. If so, state details.
              </p>
              <div className="flex-1">{formdata.data!.q15}</div>
            </div>
            <div className="flex gap-8 border-b border-gray-200 pb-2 mb-2 px-16">
              <p className="flex-1 text-sm text-gray-500">
                (15) Is there a road from where the land is easily accessible ?
                State the name of the road and whether it is Highway, Major
                district road or village road. What is the distance of the
                proposed building or other work from the center of the road.
              </p>
              <div className="flex-1">{formdata.data!.q16}</div>
            </div>
            <div className="flex gap-8 border-b border-gray-200 pb-2 mb-2 px-16">
              <p className="flex-1 text-sm text-gray-500">
                (16) If there is no road adjoining the land, how is it proposed
                to be provided for access to the site.
              </p>
              <div className="flex-1">{formdata.data!.q17}</div>
            </div>
            <div className="flex gap-8 border-b border-gray-200 pb-2 mb-2 px-16">
              <p className="flex-1 text-sm text-gray-500">
                (17) Was a similar application made in the past for
                non-agricultural use of this land and was it rejected If yes,
                give details.
              </p>
              <div className="flex-1">{formdata.data!.q18}</div>
            </div>
          </div>
        </>
      ) : (
        <></>
      ),
    },
    {
      key: "3",
      label: "Correspondence",
      children: formdata.data ? (
        <CorrespondencePage id={formdata.data!.id} />
      ) : (
        <></>
      ),
    },
    {
      key: "4",
      label: "Report",
      children: formdata.data ? <ReportPage id={formdata.data!.id} /> : <></>,
    },
    {
      key: "5",
      label: "Payment History",
      children: formdata.data ? (
        <PaymentHistoryPage id={formdata.data!.id} />
      ) : (
        <></>
      ),
    },
    {
      key: "6",
      label: "Noting",
      children: formdata.data ? (
        <>
          <div className="flex items-center mb-2 gap-2">
            <div className="grow"></div>
            <button
              onClick={() => {
                setIsNoting(!isNoting);
                setIsHearing(false);
                setIsSanad(false);
                setIsIntimation(false);
              }}
              className="bg-blue-500 text-white px-4 py-1 rounded-md text-sm"
            >
              {isNoting ? "Hide Noting" : "Add Noting"}
            </button>
          </div>
          <NotingPage id={formdata.data!.id} />
        </>
      ) : (
        <></>
      ),
    },
    {
      key: "7",
      label: "Hearing Notice",
      children: formdata.data ? (
        <>
          <div className="flex items-center mb-2 gap-2">
            <div className="grow"></div>
            <button
              onClick={() => {
                setIsHearing(!isHearing);
                setIsNoting(false);
                setIsSanad(false);
                setIsIntimation(false);
              }}
              className="bg-blue-500 text-white px-4 py-1 rounded-md text-sm"
            >
              {isHearing ? "Hide Hearing" : "Add Hearing"}
            </button>
          </div>
          <HearingNoticePage id={formdata.data!.id} />
        </>
      ) : (
        <></>
      ),
    },
    {
      key: "8",
      label: "Sanad",
      children: formdata.data ? (
        <>
          <div className="flex items-center mb-2 gap-2">
            <div className="grow"></div>
            <button
              onClick={() => {
                setIsSanad(!isSanad);
                setIsNoting(false);
                setIsHearing(false);
                setIsIntimation(false);
              }}
              className="bg-blue-500 text-white px-4 py-1 rounded-md text-sm"
            >
              {isSanad ? "Hide Sanad" : "Add Sanad"}
            </button>
          </div>
          <SanadPage id={formdata.data!.id} />
        </>
      ) : (
        <></>
      ),
    },
    {
      key: "9",
      label: "Intimation Order",
      children: formdata.data ? (
        <>
          <div className="flex items-center mb-2 gap-2">
            <div className="grow"></div>
            <button
              onClick={() => {
                setIsIntimation(!isIntimation);
                setIsNoting(false);
                setIsHearing(false);
                setIsSanad(false);
              }}
              className="bg-blue-500 text-white px-4 py-1 rounded-md text-sm"
            >
              {isIntimation ? "Hide Intimation" : "Add Intimation"}
            </button>
          </div>
          <IntimationOrderPage id={formdata.data!.id} />
        </>
      ) : (
        <></>
      ),
    },
  ];

  if (formdata.isLoading) {
    return (
      <div className="w-full h-screen grid place-items-center">Loading...</div>
    );
  }

  if (formdata.isError) {
    return (
      <div className="w-full h-screen grid place-items-center">
        <p className="text-red-500">Error: {formdata.error.message}</p>
      </div>
    );
  }

  return (
    <>
      <div className="p-2 grid grid-cols-12 gap-1 min-h-screen">
        <div
          className={`shadow rounded p-2  bg-[#fff] ${
            isNoting || isHearing || isSanad || isIntimation
              ? "col-span-6"
              : "col-span-12"
          }  flex flex-col`}
        >
          <div className="flex-1 flex flex-col ">
            <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
          </div>
        </div>
        {isNoting && (
          <div
            className={`bg-white shadow rounded p-2 ${
              isNoting ? "col-span-6" : ""
            }`}
          >
            <NotingEditor id={formdata.data!.id} />
          </div>
        )}

        {isHearing && (
          <div
            className={`bg-white shadow rounded p-2 ${
              isHearing ? "col-span-6" : ""
            }`}
          >
            <HearingNoticeEditor id={formdata.data!.id} />
          </div>
        )}

        {isSanad && (
          <div
            className={`bg-white shadow rounded p-2 ${
              isSanad ? "col-span-6" : ""
            }`}
          >
            <SanadGenerateEditor id={formdata.data!.id} />
          </div>
        )}

        {isIntimation && (
          <div
            className={`bg-white shadow rounded p-2 ${
              isIntimation ? "col-span-6" : ""
            }`}
          >
            <IntimationOrderEditor id={formdata.data!.id} />
          </div>
        )}
      </div>

      <div className="fixed top-2 left-2 z-50">
        <button
          className="bg-blue-500 text-white px-2 py-2 rounded-full hover:bg-blue-600 transition-colors text-xs"
          onClick={() => router.back()}
        >
          <IcBaselineArrowBack className="scale-150" />
        </button>
      </div>
    </>
  );
};

export default Meeting;

interface CorrespondenceProviderProps {
  id: number;
}

const CorrespondencePage = (props: CorrespondenceProviderProps) => {
  const chatdata = useQuery({
    queryKey: [
      "getQueryByType",
      props.id,
      ["QUERY", "CORESPONDENCE", "UPDATES", "REPORT", "SUBMITREPORT"],
    ],
    queryFn: async () => {
      const response = await ApiCall({
        query:
          "query GetQueryByType($id: Int!, $querytype: [QueryType!]!) {getQueryByType(id: $id, querytype: $querytype) {id,query,upload_url_1,type,request_type,createdAt,from_user {id, firstName,lastName,role},to_user {id, firstName,lastName,role},}}",
        variables: {
          id: props.id,
          querytype: [
            "QUERY",
            "CORESPONDENCE",
            "UPDATES",
            "REPORT",
            "SUBMITREPORT",
          ],
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

  return (
    <>
      {chatdata.data?.length === 0 && (
        <div>
          <Alert message="No Correspondence Found." type="error" showIcon />
        </div>
      )}

      {chatdata.data?.map((field, index) => {
        return (
          <UserChat
            key={index}
            name={`${field.from_user.firstName} ${field.from_user.lastName}`}
            fromrole={field.from_user.role}
            torole={field.to_user.role}
            message={field.query}
            time={new Date(field.createdAt)}
            url={field.upload_url_1}
            type={field.type}
          />
        );
        // if (field.from_user.role === "USER") {
        // if (field.type === "CORESPONDENCE") {
        //   return (
        //     <UserChat
        //       key={index}
        //       name={`${field.from_user.firstName} ${field.from_user.lastName}`}
        //       fromrole={field.from_user.role}
        //       torole={field.to_user.role}
        //       message={field.query}
        //       time={new Date(field.createdAt)}
        //       url={field.upload_url_1}
        //       type={field.type}
        //     />
        //   );
        // } else {
        //   return (
        //     <DeptChat
        //       key={index}
        //       name={`${field.to_user.firstName} ${field.to_user.lastName}`}
        //       fromrole={field.from_user.role}
        //       torole={field.to_user.role}
        //       message={field.query}
        //       time={new Date(field.createdAt)}
        //       url={field.upload_url_1}
        //       type={field.type}
        //     />
        //   );
        // }
      })}
    </>
  );
};

interface NotingProviderProps {
  id: number;
}

const NotingPage = (props: NotingProviderProps) => {
  const userid = getCookie("id");

  const notingdata = useQuery({
    queryKey: ["getQueryByType", Number(props.id), ["NOTING", "PRENOTE"]],
    queryFn: async () => {
      const response = await ApiCall({
        query:
          "query GetQueryByType($id: Int!, $querytype: [QueryType!]!) {getQueryByType(id: $id, querytype: $querytype) {id,query,upload_url_1,type,request_type,createdAt,from_user {id, firstName,lastName,role},to_user {id, firstName,lastName,role},}}",
        variables: {
          id: props.id,
          querytype: ["NOTING", "PRENOTE"],
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

  return (
    <>
      {notingdata.data?.length === 0 && (
        <div>
          <Alert message="No Notings found." type="error" showIcon />
        </div>
      )}

      {(() => {
        if (!notingdata.data) return null;

        // Find latest PRENOTE entry
        const latestPrenote = [...notingdata.data]
          .filter((item) => item.type === "PRENOTE")
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )[0];

        return notingdata.data.map((field, index) => {
          // Show only the latest PRENOTE
          if (field.type === "PRENOTE") {
            if (field !== latestPrenote) return null; // skip other PRENOTEs
            return (
              <ShowEditor
                key={`prenote-${index}`}
                data={field.query}
                fromrole={field.from_user.role}
                torole={field.to_user.role}
                name={`${field.from_user.firstName} ${field.from_user.lastName}`}
                time={new Date(field.createdAt)}
                type={field.type}
              />
            );
          }

          return (
            <UserChat
              key={`user-${index}`}
              name={`${field.from_user.firstName} ${field.from_user.lastName}`}
              fromrole={field.from_user.role}
              torole={field.to_user.role}
              message={field.query}
              time={new Date(field.createdAt)}
              url={field.upload_url_1}
              type={field.type}
            />
          );

          // if (field.from_user.id === Number(userid)) {
          //   return (
          //     <UserChat
          //       key={`user-${index}`}
          //       name={`${field.from_user.firstName} ${field.from_user.lastName}`}
          //       fromrole={field.from_user.role}
          //       torole={field.to_user.role}
          //       message={field.query}
          //       time={new Date(field.createdAt)}
          //       url={field.upload_url_1}
          //       type={field.type}
          //     />
          //   );
          // } else {
          //   return (
          //     <DeptChat
          //       key={`dept-${index}`}
          //       name={`${field.to_user.firstName} ${field.to_user.lastName}`}
          //       fromrole={field.from_user.role}
          //       torole={field.to_user.role}
          //       message={field.query}
          //       time={new Date(field.createdAt)}
          //       url={field.upload_url_1}
          //       type={field.type}
          //     />
          //   );
          // }
        });
      })()}
    </>
  );
};

interface HearingNoticeProps {
  id: number;
}

const HearingNoticePage = (props: HearingNoticeProps) => {
  const userid = getCookie("id");

  const notingdata = useQuery({
    queryKey: ["getQueryByType", Number(props.id), ["HEARING_NOTICE"]],
    queryFn: async () => {
      const response = await ApiCall({
        query:
          "query GetQueryByType($id: Int!, $querytype: [QueryType!]!) {getQueryByType(id: $id, querytype: $querytype) {id,query,upload_url_1,type,request_type,createdAt,from_user {id, firstName,lastName,role},to_user {id, firstName,lastName,role},}}",
        variables: {
          id: props.id,
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

  return (
    <>
      {notingdata.data?.length === 0 && (
        <div>
          <Alert message="No Notings found." type="error" showIcon />
        </div>
      )}

      {(() => {
        if (!notingdata.data) return null;

        // Find latest PRENOTE entry
        const latestPrenote = [...notingdata.data]
          .filter((item) => item.type === "HEARING_NOTICE")
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )[0];

        return notingdata.data.map((field, index) => {
          // Show only the latest HEARING_NOTICE
          if (field.type === "HEARING_NOTICE") {
            if (field !== latestPrenote) return null; // skip other HEARING_NOTICES
            return (
              <ShowEditor
                key={`hearing_notice-${index}`}
                data={field.query}
                fromrole={field.from_user.role}
                torole={field.to_user.role}
                name={`${field.from_user.firstName} ${field.from_user.lastName}`}
                time={new Date(field.createdAt)}
                type={field.type}
              />
            );
          }

          return (
            <UserChat
              key={`user-${index}`}
              name={`${field.from_user.firstName} ${field.from_user.lastName}`}
              fromrole={field.from_user.role}
              torole={field.to_user.role}
              message={field.query}
              time={new Date(field.createdAt)}
              url={field.upload_url_1}
              type={field.type}
            />
          );

          // if (field.from_user.id === Number(userid)) {
          //   return (
          //     <UserChat
          //       key={`user-${index}`}
          //       name={`${field.from_user.firstName} ${field.from_user.lastName}`}
          //       fromrole={field.from_user.role}
          //       torole={field.to_user.role}
          //       message={field.query}
          //       time={new Date(field.createdAt)}
          //       url={field.upload_url_1}
          //       type={field.type}
          //     />
          //   );
          // } else {
          //   return (
          //     <DeptChat
          //       key={`dept-${index}`}
          //       name={`${field.to_user.firstName} ${field.to_user.lastName}`}
          //       fromrole={field.from_user.role}
          //       torole={field.to_user.role}
          //       message={field.query}
          //       time={new Date(field.createdAt)}
          //       url={field.upload_url_1}
          //       type={field.type}
          //     />
          //   );
          // }
        });
      })()}
    </>
  );
};

interface SanadPageProps {
  id: number;
}

const SanadPage = (props: SanadPageProps) => {
  const userid = getCookie("id");

  const notingdata = useQuery({
    queryKey: ["getQueryByType", Number(props.id), ["SANAD"]],
    queryFn: async () => {
      const response = await ApiCall({
        query:
          "query GetQueryByType($id: Int!, $querytype: [QueryType!]!) {getQueryByType(id: $id, querytype: $querytype) {id,query,upload_url_1,type,request_type,createdAt,from_user {id, firstName,lastName,role},to_user {id, firstName,lastName,role},}}",
        variables: {
          id: props.id,
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

  return (
    <>
      {notingdata.data?.length === 0 && (
        <div>
          <Alert message="No Notings found." type="error" showIcon />
        </div>
      )}

      {(() => {
        if (!notingdata.data) return null;

        // Find latest SANAD entry
        const latestPrenote = [...notingdata.data]
          .filter((item) => item.type === "SANAD")
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )[0];

        return notingdata.data.map((field, index) => {
          // Show only the latest SANAD
          if (field.type === "SANAD") {
            if (field !== latestPrenote) return null; // skip other SANAD
            return (
              <ShowEditor
                key={`sanad-${index}`}
                data={field.query}
                fromrole={field.from_user.role}
                torole={field.to_user.role}
                name={`${field.from_user.firstName} ${field.from_user.lastName}`}
                time={new Date(field.createdAt)}
                type={field.type}
              />
            );
          }

          return (
            <UserChat
              key={`user-${index}`}
              name={`${field.from_user.firstName} ${field.from_user.lastName}`}
              fromrole={field.from_user.role}
              torole={field.to_user.role}
              message={field.query}
              time={new Date(field.createdAt)}
              url={field.upload_url_1}
              type={field.type}
            />
          );

          // if (field.from_user.id === Number(userid)) {
          //   return (
          //     <UserChat
          //       key={`user-${index}`}
          //       name={`${field.from_user.firstName} ${field.from_user.lastName}`}
          //       fromrole={field.from_user.role}
          //       torole={field.to_user.role}
          //       message={field.query}
          //       time={new Date(field.createdAt)}
          //       url={field.upload_url_1}
          //       type={field.type}
          //     />
          //   );
          // } else {
          //   return (
          //     <DeptChat
          //       key={`dept-${index}`}
          //       name={`${field.to_user.firstName} ${field.to_user.lastName}`}
          //       fromrole={field.from_user.role}
          //       torole={field.to_user.role}
          //       message={field.query}
          //       time={new Date(field.createdAt)}
          //       url={field.upload_url_1}
          //       type={field.type}
          //     />
          //   );
          // }
        });
      })()}
    </>
  );
};

interface IntimationOrderPageProps {
  id: number;
}

const IntimationOrderPage = (props: IntimationOrderPageProps) => {
  const userid = getCookie("id");

  const notingdata = useQuery({
    queryKey: ["getQueryByType", Number(props.id), ["INTIMATION_DRAFT"]],
    queryFn: async () => {
      const response = await ApiCall({
        query:
          "query GetQueryByType($id: Int!, $querytype: [QueryType!]!) {getQueryByType(id: $id, querytype: $querytype) {id,query,upload_url_1,type,request_type,createdAt,from_user {id, firstName,lastName,role},to_user {id, firstName,lastName,role},}}",
        variables: {
          id: props.id,
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

  return (
    <>
      {notingdata.data?.length === 0 && (
        <div>
          <Alert message="No Notings found." type="error" showIcon />
        </div>
      )}

      {(() => {
        if (!notingdata.data) return null;

        // Find latest INTIMATION_DRAFT entry
        const latestPrenote = [...notingdata.data]
          .filter((item) => item.type === "INTIMATION_DRAFT")
          .sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          )[0];

        return notingdata.data.map((field, index) => {
          // Show only the latest INTIMATION_DRAFT
          if (field.type === "INTIMATION_DRAFT") {
            if (field !== latestPrenote) return null; // skip other INTIMATION_DRAFT
            return (
              <ShowEditor
                key={`intimation-${index}`}
                data={field.query}
                fromrole={field.from_user.role}
                torole={field.to_user.role}
                name={`${field.from_user.firstName} ${field.from_user.lastName}`}
                time={new Date(field.createdAt)}
                type={field.type}
              />
            );
          }

          return (
            <UserChat
              key={`user-${index}`}
              name={`${field.from_user.firstName} ${field.from_user.lastName}`}
              fromrole={field.from_user.role}
              torole={field.to_user.role}
              message={field.query}
              time={new Date(field.createdAt)}
              url={field.upload_url_1}
              type={field.type}
            />
          );
          // if (field.from_user.id === Number(userid)) {
          //   return (
          //     <UserChat
          //       key={`user-${index}`}
          //       name={`${field.from_user.firstName} ${field.from_user.lastName}`}
          //       fromrole={field.from_user.role}
          //       torole={field.to_user.role}
          //       message={field.query}
          //       time={new Date(field.createdAt)}
          //       url={field.upload_url_1}
          //       type={field.type}
          //     />
          //   );
          // } else {
          //   return (
          //     <DeptChat
          //       key={`dept-${index}`}
          //       name={`${field.to_user.firstName} ${field.to_user.lastName}`}
          //       fromrole={field.from_user.role}
          //       torole={field.to_user.role}
          //       message={field.query}
          //       time={new Date(field.createdAt)}
          //       url={field.upload_url_1}
          //       type={field.type}
          //     />
          //   );
          // }
        });
      })()}
    </>
  );
};

interface FeesHistoryResponseData {
  id: number;
  purpose: string;
  amount: number;
  is_paid: boolean;
  payment_mode: string;
  payment_type: string;
}

interface PaymentHistoryProviderProps {
  id: number;
}

const PaymentHistoryPage = (props: PaymentHistoryProviderProps) => {
  const paymenthistorydata = useQuery({
    queryKey: ["getPaymentHistory"],
    queryFn: async () => {
      const response = await ApiCall({
        query:
          "query GetFeesHistory($id: Int!) { getFeesHistory(id: $id) { id, purpose, amount, is_paid, payment_mode, payment_type }}",
        variables: {
          id: props.id,
        },
      });

      if (!response.status) {
        throw new Error(response.message);
      }

      if (!(response.data as Record<string, unknown>)["getFeesHistory"]) {
        throw new Error("Value not found in response");
      }
      return (response.data as Record<string, unknown>)[
        "getFeesHistory"
      ] as FeesHistoryResponseData[];
    },
  });

  const pendingpaymentdata = useQuery({
    queryKey: ["getPendingNaFee"],
    queryFn: async () => {
      const response = await ApiCall({
        query:
          "query GetPendingNaFee($id: Int!) {getPendingNaFee(id: $id) {id,purpose,amount,is_paid,payment_mode,payment_type}}",
        variables: {
          id: props.id,
        },
      });

      if (!response.status) {
        throw new Error(response.message);
      }

      if (!(response.data as Record<string, unknown>)["getFeesHistory"]) {
        throw new Error("Value not found in response");
      }
      return (response.data as Record<string, unknown>)[
        "getFeesHistory"
      ] as FeesHistoryResponseData[];
    },
  });

  // if (paymenthistorydata.isLoading || pendingpaymentdata.isLoading) {
  //   return (
  //     <>
  //       <p className="text-gray-500 text-center">Loading payment history...</p>
  //     </>
  //   );
  // }

  return (
    <>
      {paymenthistorydata.data?.length === 0 && (
        <div>
          <Alert message="No Payment Request Found." type="error" showIcon />
        </div>
      )}

      {paymenthistorydata.data?.map((field, index) => (
        <div key={index} className="px-2 py-2">
          <p className="text-sm text-blue-700 font-semibold leading-2">
            Purpose
          </p>
          <p className="text-sm leading-4 mt-2">{field.purpose}</p>

          <div className="flex items-center mt-2 gap-4">
            <p className="text-sm rounded px-4 text-center border border-gray-500 bg-gray-500/10 text-gray-500">
              Amount: ₹{field.amount}
            </p>
            <p className="text-sm rounded px-4 text-center border border-orange-500 bg-orange-500/10 text-orange-500">
              {field.payment_type}
            </p>

            {field.is_paid ? (
              <>
                <p className="text-sm rounded px-4 text-center border border-green-500 bg-green-500/10 text-green-500">
                  Paid
                </p>
              </>
            ) : (
              <p className="text-sm rounded px-4 text-center border border-red-500 bg-red-500/10 text-red-500">
                Unpaid
              </p>
            )}
          </div>
          <div className="h-[1px] w-full bg-gray-200 mt-2"></div>
        </div>
      ))}
    </>
  );
};

interface ReportProviderProps {
  id: number;
}

const ReportPage = (props: ReportProviderProps) => {
  const userid = getCookie("id");
  const currentuserrole: string = getCookie("role") as string;

  const reportdata = useQuery({
    queryKey: ["getQueryByType", props.id, ["REPORT", "SUBMITREPORT"]],
    queryFn: async () => {
      const response = await ApiCall({
        query:
          "query GetQueryByType($id: Int!, $querytype: [QueryType!]!) {getQueryByType(id: $id, querytype: $querytype) {id,query,upload_url_1,type,request_type,createdAt,from_user {id, firstName,lastName,role},to_user {id, firstName,lastName,role},}}",
        variables: {
          id: props.id,
          querytype: ["REPORT", "SUBMITREPORT"],
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

  return (
    <>
      {reportdata.data?.length === 0 && (
        <div>
          <Alert message="No Notings found." type="error" showIcon />
        </div>
      )}
      {["TALATHI", "DNHPDA", "LAQ", "LRO"].includes(currentuserrole)
        ? reportdata.data?.map((field, index) => {
            if (
              field.to_user.id == Number(userid) ||
              field.from_user.id == Number(userid)
            ) {
              return (
                <UserChat
                  key={index}
                  name={`${field.from_user.firstName} ${field.from_user.lastName}`}
                  fromrole={field.from_user.role}
                  torole={field.to_user.role}
                  message={field.query}
                  time={new Date(field.createdAt)}
                  url={field.upload_url_1}
                  type={field.type}
                />
              );
              // if (field.from_user.id == Number(userid)) {
              // if (field.type == "SUBMITREPORT") {
              //   return (
              //     <UserChat
              //       key={index}
              //       name={`${field.from_user.firstName} ${field.from_user.lastName}`}
              //       fromrole={field.from_user.role}
              //       torole={field.to_user.role}
              //       message={field.query}
              //       time={new Date(field.createdAt)}
              //       url={field.upload_url_1}
              //       type={field.type}
              //     />
              //   );
              // } else {
              //   return (
              //     <DeptChat
              //       key={index}
              //       name={`${field.to_user.firstName} ${field.to_user.lastName}`}
              //       fromrole={field.from_user.role}
              //       torole={field.to_user.role}
              //       message={field.query}
              //       time={new Date(field.createdAt)}
              //       url={field.upload_url_1}
              //       type={field.type}
              //     />
              //   );
              // }
            }
          })
        : reportdata.data?.map((field, index) => {
            return (
              <UserChat
                key={index}
                name={`${field.from_user.firstName} ${field.from_user.lastName}`}
                fromrole={field.from_user.role}
                torole={field.to_user.role}
                message={field.query}
                time={new Date(field.createdAt)}
                url={field.upload_url_1}
                type={field.type}
              />
            );
            // if (field.from_user.id == Number(userid)) {

            // if (field.type == "SUBMITREPORT") {
            //   return (
            //     <UserChat
            //       key={index}
            //       name={`${field.from_user.firstName} ${field.from_user.lastName}`}
            //       fromrole={field.from_user.role}
            //       torole={field.to_user.role}
            //       message={field.query}
            //       time={new Date(field.createdAt)}
            //       url={field.upload_url_1}
            //       type={field.type}
            //     />
            //   );
            // } else {
            //   return (
            //     <DeptChat
            //       key={index}
            //       name={`${field.to_user.firstName} ${field.to_user.lastName}`}
            //       fromrole={field.from_user.role}
            //       torole={field.to_user.role}
            //       message={field.query}
            //       time={new Date(field.createdAt)}
            //       url={field.upload_url_1}
            //       type={field.type}
            //     />
            //   );
            // }
          })}
    </>
  );
};
