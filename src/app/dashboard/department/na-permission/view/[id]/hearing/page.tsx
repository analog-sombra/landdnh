"use client";
import {
  Collapse,
  Tabs,
  Popover,
  Modal,
  DatePicker,
  TimePicker,
  Checkbox,
} from "antd";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { decryptURLData, formatDateTime, formateDate } from "@/utils/methods";
import { ApiCall } from "@/services/api";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { baseurl } from "@/utils/const";
import { Alert, Drawer } from "antd";
import { FormProvider, useForm } from "react-hook-form";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { getCookie } from "cookies-next/client";
import { RequestPaymentForm, RequestPaymentSchema } from "@/schema/forms/fees";
import {
  NotingForm,
  NotingSchema,
  QueryForm,
  QuerySchema,
} from "@/schema/forms/query";
import { IcBaselineArrowBack } from "@/components/icons";
import { ViewEditor } from "@/components/editors/vieweditro/page";

interface NaFormResponse {
  id: number;
  dept_status: string;
  last_name: string;
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
  const [correspondenceBox, setCorrespondenceBox] = useState<boolean>(false);
  const [notingBox, setNotingBox] = useState<boolean>(false);
  const [reportBox, setReportBox] = useState<boolean>(false);
  const [paymentHistoryBox, setPaymentHistoryBox] = useState<boolean>(false);
  const [rescheduleBox, setRescheduleBox] = useState<boolean>(false);

  const router = useRouter();

  const { id } = useParams<{ id: string | string[] }>();
  const idString = Array.isArray(id) ? id[0] : id;
  const formid: number = parseInt(decryptURLData(idString, router));
  const onChange = (key: string) => {
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

  const data = [
    {
      key: "1",
      label: "Applicant information",
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
      label: "Land information",
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
      label: "CASE INFO",
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
      label: "FORM",
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
            {/* <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"> */}
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
              <p className="text-sm text-gray-700">
                Annexure 1: Application for Non-Agricultural Permission
              </p>
              <div className="grow"></div>

              <Link
                target="_blank"
                href={`${baseurl}/${formdata.data!.anx1}`}
                className="bg-gray-200 text-black py-1 px-4 rounded-md text-sm h-8 grid place-items-center"
              >
                View File
              </Link>
            </div>
            <div className="flex gap-8 border-b border-gray-200 pb-2 mb-2 px-16">
              <p className="text-sm text-gray-700">Annexure 2: Land Records</p>
              <div className="grow"></div>

              <Link
                target="_blank"
                href={`${baseurl}/${formdata.data!.anx2}`}
                className="bg-gray-200 text-black py-1 px-4 rounded-md text-sm h-8 grid place-items-center"
              >
                View File
              </Link>
            </div>
            <div className="flex gap-8 border-b border-gray-200 pb-2 mb-2 px-16">
              <p className="text-sm text-gray-700">Annexure 3: Land Records</p>
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
              <p className="text-sm text-gray-700">Annexure 4: Land Records</p>
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
              <p className="text-sm text-gray-700">Annexure 5: Land Records</p>
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
      <div className="p-4 grid grid-cols-12 gap-2 min-h-screen">
        <div className="bg-white shadow rounded p-2 col-span-8 flex flex-col">
          <div className="flex-1 flex flex-col">
            <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
          </div>
        </div>
        <div className="bg-white shadow rounded p-2 col-span-4">
          <div className="flex items-center border-b pb-1 border-gray-300">
            <p>Attendance: </p>
            <div className="grow"></div>
            <Popover
              placement="bottomRight"
              content={
                <div className="flex flex-col gap-2">
                  <button className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600 transition-colors">
                    Attendance
                  </button>
                  <button
                    className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600 transition-colors"
                    onClick={() => setCorrespondenceBox(true)}
                  >
                    Correspondence
                  </button>
                  <button
                    className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600 transition-colors"
                    onClick={() => setNotingBox(true)}
                  >
                    Notings
                  </button>
                  <button
                    className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600 transition-colors"
                    onClick={() => setReportBox(true)}
                  >
                    Report
                  </button>
                  <button
                    className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600 transition-colors"
                    onClick={() => setPaymentHistoryBox(true)}
                  >
                    Payment
                  </button>
                  <button
                    className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600 transition-colors"
                    onClick={() => setRescheduleBox(true)}
                  >
                    Reschedule
                  </button>
                </div>
              }
              title="Actions"
            >
              <button className="bg-blue-500 text-white px-4 py-1 rounded-md hover:bg-blue-600 transition-colors text-xs ">
                Action
              </button>
            </Popover>
          </div>
          {formdata.data && formdata.data.dept_status == "HEARING_SCHEDULED" ? (
            <>
              <div className="overflow-x-auto">
                <table className="w-full mt-2 border-collapse border border-gray-200">
                  <tbody>
                    <tr className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-1 font-normal text-sm">
                        Collector
                      </td>
                      <td className="border border-gray-300 px-4 py-1 font-normal text-sm">
                        <Checkbox />
                      </td>
                      <td className="border border-gray-300 px-4 py-1 font-normal text-sm">
                        <button className="bg-blue-500 text-white px-4 py-1 rounded-md hover:bg-blue-600 transition-colors">
                          Submit
                        </button>
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-1 font-normal text-sm">
                        Mamlatdar
                      </td>
                      <td className="border border-gray-300 px-4 py-1 font-normal text-sm">
                        <Checkbox />
                      </td>
                      <td className="border border-gray-300 px-4 py-1 font-normal text-sm">
                        <button className="bg-blue-500 text-white px-4 py-1 rounded-md hover:bg-blue-600 transition-colors">
                          Submit
                        </button>
                      </td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-4 py-1 font-normal text-sm">
                        Ldcmamlatdar
                      </td>
                      <td className="border border-gray-300 px-4 py-1 font-normal text-sm">
                        <Checkbox />
                      </td>
                      <td className="border border-gray-300 px-4 py-1 font-normal text-sm">
                        <button className="bg-blue-500 text-white px-4 py-1 rounded-md hover:bg-blue-600 transition-colors">
                          Submit
                        </button>
                      </td>
                    </tr>
                    {formdata.data?.na_applicant.map((applicant, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-4 py-1 font-normal text-sm">
                          {applicant.firstName} {applicant.lastName}
                        </td>
                        <td className="border border-gray-300 px-4 py-1 font-normal text-sm">
                          <Checkbox />
                        </td>
                        <td className="border border-gray-300 px-4 py-1 font-normal text-sm">
                          <button className="bg-blue-500 text-white px-4 py-1 rounded-md hover:bg-blue-600 transition-colors">
                            Submit
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <div className="mt-4">
              <Alert
                message="Hearing not scheduled"
                type="info"
                showIcon
                className="mt-2"
              />
            </div>
          )}
        </div>
        <Drawer
          placement="right"
          onClose={() => setCorrespondenceBox(false)}
          open={correspondenceBox}
          closable={false}
          width={400}
          size="large"
          className="bg-white"
          styles={{
            body: {
              paddingLeft: "10px",
              paddingRight: "10px",
              paddingTop: "10px",
              paddingBottom: "0px",
            },
          }}
        >
          <CorrespondenceProvider
            setCorrespondenceBox={setCorrespondenceBox}
            createdById={formdata.data!.createdById}
            id={formdata.data!.id}
          />
        </Drawer>

        <Drawer
          placement="right"
          onClose={() => setNotingBox(false)}
          open={notingBox}
          closable={false}
          width={400}
          size="large"
          className="bg-white"
          styles={{
            body: {
              paddingLeft: "10px",
              paddingRight: "10px",
              paddingTop: "10px",
              paddingBottom: "0px",
            },
          }}
        >
          <NotingProvider setNotingBox={setNotingBox} id={formdata.data!.id} />
        </Drawer>

        <Drawer
          placement="right"
          onClose={() => setReportBox(false)}
          open={reportBox}
          closable={false}
          width={400}
          size="large"
          className="bg-white"
          styles={{
            body: {
              paddingLeft: "10px",
              paddingRight: "10px",
              paddingTop: "10px",
              paddingBottom: "0px",
            },
          }}
        >
          <ReportProvider setReportBox={setReportBox} id={formdata.data!.id} />
        </Drawer>
        <Drawer
          placement="right"
          onClose={() => setPaymentHistoryBox(false)}
          open={paymentHistoryBox}
          closable={false}
          width={400}
          className="bg-white"
          styles={{
            body: {
              paddingLeft: "10px",
              paddingRight: "10px",
              paddingTop: "10px",
              paddingBottom: "0px",
            },
          }}
        >
          <div>
            <PaymentHistoryProvider
              setPaymentHistoryBox={setPaymentHistoryBox}
              id={formdata.data!.id}
            />
          </div>
        </Drawer>

        <Modal
          title="Reschedule Meeting"
          closable={{ "aria-label": "Custom Close Button" }}
          open={rescheduleBox}
          onOk={() => setRescheduleBox(false)}
          onCancel={() => setRescheduleBox(false)}
        >
          <p>Are you sure you want to reschedule.</p>
          <div className="mt-2"></div>
          <DatePicker style={{ width: "100%" }} />
          <div className="mt-2"></div>
          <TimePicker
            format="HH:mm"
            placeholder="Select Time"
            minuteStep={15}
            showNow={false}
            use12Hours={false}
            style={{ width: "100%" }}
          />
        </Modal>
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
  setCorrespondenceBox: React.Dispatch<React.SetStateAction<boolean>>;
  createdById: number;
  id: number;
}

const CorrespondenceProvider = (props: CorrespondenceProviderProps) => {
  const methods = useForm<QueryForm>({
    resolver: valibotResolver(QuerySchema),
  });

  return (
    <>
      <FormProvider {...methods}>
        <CorrespondencePage
          setCorrespondenceBox={props.setCorrespondenceBox}
          createdById={props.createdById}
          id={props.id}
        />
      </FormProvider>
    </>
  );
};

const CorrespondencePage = (props: CorrespondenceProviderProps) => {
  const chatdata = useQuery({
    queryKey: ["getQueryByType", props.id],
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
      <div className="flex items-center gap-2">
        <p className="text-gray-700 text-lg ">Correspondence</p>
        <div className="grow"></div>

        <button
          type="button"
          onClick={() => props.setCorrespondenceBox(false)}
          className="py-1 rounded-md bg-rose-500 px-4 text-sm text-white cursor-pointer w-28 text-nowrap"
        >
          Close
        </button>
      </div>

      {chatdata.data?.length === 0 && (
        <div className="mt-2">
          <Alert message="No Query Found." type="error" showIcon />
        </div>
      )}

      {chatdata.data?.map((field, index) => {
        if (field.from_user.role === "USER") {
          return (
            <UserChat
              key={index}
              name={`${field.from_user.firstName} ${field.from_user.lastName}`}
              fromrole={field.from_user.role}
              torole={field.to_user.role}
              message={field.query}
              time={new Date(field.createdAt)}
              url={field.upload_url_1}
            />
          );
        } else {
          return (
            <DeptChat
              key={index}
              name={`${field.to_user.firstName} ${field.to_user.lastName}`}
              fromrole={field.from_user.role}
              torole={field.to_user.role}
              message={field.query}
              time={new Date(field.createdAt)}
              url={field.upload_url_1}
            />
          );
        }
      })}
    </>
  );
};

interface DeptChatProps {
  name: string;
  fromrole: string;
  torole: string;
  message: string;
  time: Date;
  url?: string | null;
}

const DeptChat = (props: DeptChatProps) => {
  return (
    <div className="mt-4">
      <div className="flex items-center gap-1 max-w-5/6">
        <div className="shrink-0 h-6 w-6 rounded-full bg-rose-500 grid place-items-center text-xs text-white font-semibold">
          {props.name.charAt(0).toUpperCase()}
        </div>
        <div className="px-2 py-1 bg-gray-100 rounded-md pb-2 my-1">
          <p className="text-xs text-gray-500 border-b">
            {/* {props.name} ({props.role}) */}
            {props.fromrole} to {props.torole}
          </p>
          <p className="text-sm leading-4 mt-1">{props.message}</p>
          {props.url && (
            <Link
              target="_blank"
              href={props.url}
              className="text-left text-sm text-nowrap inline-block text-white"
            >
              View File
            </Link>
          )}
        </div>
      </div>
      <p className="text-xs text-left pl-9 text-gray-500 leading-2 max-w-5/6">
        {formatDateTime(props.time)}
      </p>
    </div>
  );
};

interface UserChatProps {
  name: string;
  fromrole: string;
  torole: string;
  message: string;
  time: Date;
  url?: string | null;
}

const UserChat = (props: UserChatProps) => {
  return (
    <div className="mt-4 flex items-end flex-col">
      <div className="flex items-center gap-1 max-w-5/6">
        <div className="px-2 py-1 bg-blue-500 rounded-md pb-2 my-1">
          <p className="text-xs text-white border-b">
            {props.fromrole} to {props.torole}
          </p>
          <p className="text-sm leading-4 mt-1 text-white">{props.message}</p>
          {props.url && (
            <Link
              target="_blank"
              href={props.url}
              className="text-left text-sm text-nowrap inline-block text-white border border-white px-2 rounded mt-2"
            >
              <p className="text-white inline-block">View File</p>
            </Link>
          )}
        </div>
        <div className="shrink-0 h-6 w-6 rounded-full bg-rose-500 grid place-items-center text-xs text-white font-semibold">
          {props.name.charAt(0).toUpperCase()}
        </div>
      </div>
      <p className="text-xs text-left text-gray-500 leading-2 max-w-5/6 pr-9">
        {formatDateTime(props.time)}
      </p>
    </div>
  );
};

interface ShowEditorProps {
  name: string;
  fromrole: string;
  torole: string;
  data: string;
  time: Date;
}

const ShowEditor = (props: ShowEditorProps) => {
  return (
    <div className="mt-4">
      <div className="flex items-center gap-1 max-w-5/6">
        <div className="shrink-0 h-6 w-6 rounded-full bg-rose-500 grid place-items-center text-xs text-white font-semibold">
          {props.name.charAt(0).toUpperCase()}
        </div>
        <div className="px-2 py-1 bg-gray-100 rounded-md pb-2 my-1">
          <p className="text-xs text-gray-500 border-b">
            {props.fromrole} to {props.torole}
          </p>
          <ViewEditor data={props.data} />
        </div>
      </div>
      <p className="text-xs text-left pl-9 text-gray-500 leading-2 max-w-5/6">
        {formatDateTime(props.time)}
      </p>
    </div>
  );
};

interface NotingProviderProps {
  setNotingBox: React.Dispatch<React.SetStateAction<boolean>>;
  id: number;
}

const NotingProvider = (props: NotingProviderProps) => {
  const methods = useForm<NotingForm>({
    resolver: valibotResolver(NotingSchema),
  });

  return (
    <>
      <FormProvider {...methods}>
        <NotingPage setNotingBox={props.setNotingBox} id={props.id} />
      </FormProvider>
    </>
  );
};

const NotingPage = (props: NotingProviderProps) => {
  const userid = getCookie("id");

  const notingdata = useQuery({
    queryKey: ["getQueryByType", props.id],
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
      <div className="flex items-center gap-2">
        <p className="text-gray-700 text-lg ">Notings</p>
        <div className="grow"></div>

        <button
          type="button"
          onClick={() => props.setNotingBox(false)}
          className="py-1 rounded-md bg-rose-500 px-4 text-sm text-white cursor-pointer w-28 text-nowrap"
        >
          Close
        </button>
      </div>

      {notingdata.data?.length === 0 && (
        <div className="mt-2">
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
              />
            );
          }

          if (field.from_user.id === Number(userid)) {
            return (
              <UserChat
                key={`user-${index}`}
                name={`${field.from_user.firstName} ${field.from_user.lastName}`}
                fromrole={field.from_user.role}
                torole={field.to_user.role}
                message={field.query}
                time={new Date(field.createdAt)}
                url={field.upload_url_1}
              />
            );
          } else {
            return (
              <DeptChat
                key={`dept-${index}`}
                name={`${field.to_user.firstName} ${field.to_user.lastName}`}
                fromrole={field.from_user.role}
                torole={field.to_user.role}
                message={field.query}
                time={new Date(field.createdAt)}
                url={field.upload_url_1}
              />
            );
          }
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
  setPaymentHistoryBox: React.Dispatch<React.SetStateAction<boolean>>;
  id: number;
}

const PaymentHistoryProvider = (props: PaymentHistoryProviderProps) => {
  const methods = useForm<RequestPaymentForm>({
    resolver: valibotResolver(RequestPaymentSchema),
  });

  return (
    <>
      <FormProvider {...methods}>
        <PaymentHistoryPage
          setPaymentHistoryBox={props.setPaymentHistoryBox}
          id={props.id}
        />
      </FormProvider>
    </>
  );
};

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

  if (paymenthistorydata.isLoading || pendingpaymentdata.isLoading) {
    return (
      <p className="text-gray-500 text-center">Loading payment history...</p>
    );
  }

  return (
    <>
      <div className="flex items-center gap-2">
        <p className="text-gray-700 text-lg ">Payment History</p>
        <div className="grow"></div>
        <button
          type="button"
          onClick={() => props.setPaymentHistoryBox(false)}
          className="py-1 rounded-md bg-rose-500 px-4 text-sm text-white cursor-pointer w-24 text-nowrap"
        >
          Close
        </button>
      </div>

      {paymenthistorydata.data?.length === 0 && (
        <div className="mt-2">
          <Alert message="No Payment Request Found." type="error" showIcon />
        </div>
      )}
      {paymenthistorydata.data?.map((field, index) => (
        <div
          key={index}
          className="bg-gradient-to-l from-blue-400 to-blue-500 shadow rounded-lg p-2 mt-3"
        >
          <p className="text-sm border-b border-white text-white">Purpose</p>
          <p className="text-xs text-white">{field.purpose}</p>
          <div className="flex items-center mt-2">
            <p className="text-white text-sm border border-white rounded-l-md flex-1 text-center">
              Amount: ₹{field.amount}
            </p>
            <p className="text-white text-sm border border-white flex-1 text-center">
              {field.payment_type}
            </p>
            <p className="text-white text-sm border border-white rounded-r-md flex-1 text-center">
              {field.is_paid ? "Paid" : "Unpaid"}
            </p>
          </div>
        </div>
      ))}
    </>
  );
};

interface ReportProviderProps {
  setReportBox: React.Dispatch<React.SetStateAction<boolean>>;
  id: number;
}

const ReportProvider = (props: ReportProviderProps) => {
  const methods = useForm<NotingForm>({
    resolver: valibotResolver(NotingSchema),
  });

  return (
    <>
      <FormProvider {...methods}>
        <ReportPage setReportBox={props.setReportBox} id={props.id} />
      </FormProvider>
    </>
  );
};

const ReportPage = (props: ReportProviderProps) => {
  const userid = getCookie("id");

  const reportdata = useQuery({
    queryKey: ["getQueryByType", props.id],
    queryFn: async () => {
      const response = await ApiCall({
        query:
          "query GetQueryByType($id: Int!, $querytype: [QueryType!]!) {getQueryByType(id: $id, querytype: $querytype) {id,query,upload_url_1,type,request_type,createdAt,from_user {id, firstName,lastName,role},to_user {id, firstName,lastName,role},}}",
        variables: {
          id: props.id,
          querytype: ["REPORT"],
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
      <div className="flex items-center gap-2">
        <p className="text-gray-700 text-lg ">Report</p>
        <div className="grow"></div>

        <button
          type="button"
          onClick={() => props.setReportBox(false)}
          className="py-1 rounded-md bg-rose-500 px-4 text-sm text-white cursor-pointer w-28 text-nowrap"
        >
          Close
        </button>
      </div>

      {reportdata.data?.length === 0 && (
        <div className="mt-2">
          <Alert message="No Notings found." type="error" showIcon />
        </div>
      )}

      {reportdata.data?.map((field, index) => {
        if (field.from_user.id == Number(userid)) {
          return (
            <UserChat
              key={index}
              name={`${field.from_user.firstName} ${field.from_user.lastName}`}
              fromrole={field.from_user.role}
              torole={field.to_user.role}
              message={field.query}
              time={new Date(field.createdAt)}
              url={field.upload_url_1}
            />
          );
        } else {
          return (
            <DeptChat
              key={index}
              name={`${field.to_user.firstName} ${field.to_user.lastName}`}
              fromrole={field.from_user.role}
              torole={field.to_user.role}
              message={field.query}
              time={new Date(field.createdAt)}
              url={field.upload_url_1}
            />
          );
        }
      })}
    </>
  );
};
