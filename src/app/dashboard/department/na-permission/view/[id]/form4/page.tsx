"use client";
import { Collapse, Drawer, Popover, Tabs } from "antd";
import { useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { decryptURLData, onFormError } from "@/utils/methods";
import { useMutation, useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { baseurl } from "@/utils/const";
import { Alert } from "antd";
import { getCookie } from "cookies-next/client";
import { IcBaselineArrowBack } from "@/components/icons";
import { UserChat } from "@/components/chat";
import { ReportDNGPDAEditor } from "@/components/editors/reportdnhpdatexteditor/page";
import { MarkToForm, QueryForm } from "@/schema/forms/query";
import { SimpleTextEditorInput } from "@/components/form/inputfields/simpletexteditorinput";
import { toast } from "react-toastify";
import { ApiCall, UploadFile } from "@/services/api";
import { useFormContext, FormProvider, useForm } from "react-hook-form";

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
    pda_id: number;
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
interface QueryResponseData {
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

const Meeting = () => {
  const [isNoting, setIsNoting] = useState<boolean>(false);
  const [queryBox, setQueryBox] = useState<boolean>(false);
  const userid = getCookie("id");

  const uploadRef = useRef<HTMLInputElement>(null);
  const [upload, setUpload] = useState<File | null>(null);
  const [queryData, setQueryData] = useState<string>("");

  const {
    handleSubmit,
    formState: { isSubmitting },
    setValue,
  } = useFormContext<MarkToForm>();

  const handleFileUpload = (ref: React.RefObject<HTMLInputElement | null>) => {
    if (ref!.current) {
      ref!.current.click();
    }
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
    setFile: React.Dispatch<React.SetStateAction<File | null>>,
    ref: React.RefObject<HTMLInputElement | null>,
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setFile(file);
      const resposne = await UploadFile(file, userid!);
      if (!resposne.status) {
        toast.error(resposne.message);
        return;
      }

      setValue(ref.current!.name as keyof QueryForm, resposne.data as string);
    }
  };

  const createquery = useMutation({
    mutationKey: ["createNaQuery"],
    mutationFn: async (data: MarkToForm) => {
      if (!userid) {
        toast.error("User ID not found");
        return;
      }

      const response = await ApiCall({
        query:
          "mutation CreateNaQuery($createNaQueryInput: CreateNaQueryInput!) {createNaQuery(createNaQueryInput: $createNaQueryInput) {id}}",
        variables: {
          createNaQueryInput: {
            createdById: parseInt(userid.toString()),
            from_userId: parseInt(userid.toString()),
            to_userId: formdata.data!.village.pda_id,
            query: queryData,
            type: data.request_type,
            na_formId: formid,
            query_status: "PENDING",
            request_type: "DEPTTODEPT",
            ...(data.upload_url_1 && {
              upload_url_1: data.upload_url_1,
            }),
            dept_update: true,
          },
        },
      });

      if (!response.status) {
        throw new Error(response.message);
      }

      if (!(response.data as Record<string, unknown>)["createNaQuery"]) {
        throw new Error("Value not found in response");
      }
      return (response.data as Record<string, unknown>)[
        "createNaQuery"
      ] as QueryResponseData;
    },
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: () => {
      toast.success("Message Sent Successfully");
      router.push("/dashboard/department/na-permission");
    },
  });

  const onSubmit = async (data: MarkToForm) => {
    setQueryBox(false);

    createquery.mutate(data);

    // chatdata.refetch();
    setValue("query", "");
    setValue("userid", userid!.toString());
    setValue("request_type", "QUERYDNHPDA");
  };

  const router = useRouter();

  const { id } = useParams<{ id: string | string[] }>();
  const idString = Array.isArray(id) ? id[0] : id;
  const formid: number = parseInt(decryptURLData(idString, router));
  const onChange = (key: string) => {
    setIsNoting(false);
  };

  const formdata = useQuery({
    queryKey: ["getnaform", formid],
    queryFn: async () => {
      const response = await ApiCall({
        query:
          "query GetNaById($id:Int!) { getNaById(id: $id) { id, dept_status, last_name, q1, q2, q3, q4, anx1, anx2, anx3, anx4, anx5, q4, q5, q6, q7, q8, q9, q10, q11, q12, q13, q14, q15, q16, q17, q18, createdById, createdAt, village{ id, name, pda_id }, na_applicant { firstName, lastName, contact,relation, signature_url }, na_survey { area, sub_division, survey_no, village { name }}}}",
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

  const items = [
    {
      key: "1",
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
              <div>
                <p className="text-sm text-gray-700">
                  Annexure 4: Other Document
                  <span className="text-red-500">
                    (to be attached in form of pdf)
                  </span>
                </p>
                <p className="ml-4">1. Affidavit/Undertaking (if applicable)</p>
                <p className="ml-4">2. Right of Way document (if applicable)</p>
                <p className="ml-4">
                  3. Documents of adjacent NA land where access is proposed
                </p>
                <p className="ml-4">4. National Highway NOC, if applicable</p>
              </div>
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
      key: "2",
      label: "Report",
      children: formdata.data ? (
        <>
          <div className="flex items-center mb-2 gap-2">
            <div className="grow"></div>

            {["DNHPDA", "PDA_MS"].includes(userdata.data?.role!) && (
              <>
                <button
                  onClick={() => {
                    setQueryBox(!queryBox);
                  }}
                  className="bg-blue-500 text-white px-4 py-1 rounded-md text-sm"
                >
                  Add Query
                </button>
                <Drawer
                  width={320}
                  closable={false}
                  onClose={() => setQueryBox(false)}
                  open={queryBox}
                  styles={{
                    body: {
                      paddingLeft: "10px",
                      paddingRight: "10px",
                      paddingTop: "10px",
                      paddingBottom: "0px",
                    },
                  }}
                >
                  <h1 className="text-lg font-semibold text-[#162f57] mb-2">
                    Query
                  </h1>
                  <form onSubmit={handleSubmit(onSubmit, onFormError)}>
                    <div>
                      <SimpleTextEditorInput<MarkToForm>
                        title="Query"
                        required={true}
                        name="query"
                        placeholder="Enter Details"
                        setQueryData={setQueryData}
                      />
                    </div>
                    <div className="flex items-center mt-2 p-2 rounded-lg bg-gray-100">
                      <p className="text-sm text-gray-700">Upload File</p>
                      <div className="grow"></div>
                      {upload ? (
                        <button
                          type="button"
                          onClick={() => setUpload(null)}
                          className="py-1 rounded-md bg-red-500 px-4 text-sm text-white cursor-pointer w-28"
                        >
                          Remove
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleFileUpload(uploadRef)}
                          className="py-1 rounded-md bg-blue-500 px-4 text-sm text-white cursor-pointer w-28 text-nowrap"
                        >
                          Upload File
                        </button>
                      )}

                      <input
                        type="file"
                        ref={uploadRef}
                        name="upload_url_1"
                        onChange={(e) =>
                          handleFileChange(e, setUpload, uploadRef)
                        }
                        className="hidden"
                      />

                      {upload && (
                        <div className="flex gap-2 items-center">
                          <Link
                            target="_blank"
                            href={URL.createObjectURL(upload!)}
                            className="bg-gray-200 text-black py-1 px-4 rounded-md text-sm h-7 grid place-items-center w-28 text-nowrap"
                          >
                            View File
                          </Link>
                        </div>
                      )}
                    </div>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="py-1 rounded-md bg-blue-500 px-4 text-sm text-white mt-2 cursor-pointer"
                    >
                      {isSubmitting ? "Loading...." : "Submit"}
                    </button>
                  </form>
                </Drawer>
              </>
            )}
            {userdata.data?.role !== "DNHPDA" && userdata.data?.role !== "PDA_MS" && (
              <button
                onClick={() => {
                  setIsNoting(!isNoting);
                }}
                className="bg-blue-500 text-white px-4 py-1 rounded-md text-sm"
              >
                {isNoting ? "Hide Report" : "Add Report"}
              </button>
            )}
          </div>
          <ReportPage id={formdata.data!.id} />
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
            isNoting ? "col-span-4" : "col-span-12"
          }  flex flex-col`}
        >
          <div className="flex-1 flex flex-col ">
            <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
          </div>
        </div>
        {isNoting && (
          <div
            className={`bg-white shadow rounded p-2 ${
              isNoting ? "col-span-8" : ""
            }`}
          >
            <ReportDNGPDAEditor id={formdata.data!.id} />
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

interface FormWrapperProps {
  id: string | string[];
}

export default function Page() {
  const methods = useForm<MarkToForm>({
    mode: "onSubmit",
    defaultValues: {
      query: "",
      userid: "",
      request_type: "QUERYDNHPDA",
    },
  });

  return (
    <FormProvider {...methods}>
      <Meeting />
    </FormProvider>
  );
}

interface ReportProviderProps {
  id: number;
}

const ReportPage = (props: ReportProviderProps) => {
  const userid = getCookie("id");
  const currentuserrole: string = getCookie("role") as string;

  const reportdata = useQuery({
    queryKey: [
      "getQueryByType",
      props.id,
      ["REPORT", "SUBMITREPORT", "REPORTDNHPDA", "QUERYDNHPDA"],
    ],
    queryFn: async () => {
      const response = await ApiCall({
        query:
          "query GetQueryByType($id: Int!, $querytype: [QueryType!]!) {getQueryByType(id: $id, querytype: $querytype) {id,query,upload_url_1,type,request_type,createdAt,from_user {id, firstName,lastName,role},to_user {id, firstName,lastName,role},}}",
        variables: {
          id: props.id,
          querytype: ["REPORT", "SUBMITREPORT", "REPORTDNHPDA", "QUERYDNHPDA"],
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
      {["TALATHI", "LAQ", "LRO", "PDA_JE"].includes(currentuserrole)
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
            }
          })
        : currentuserrole === "DNHPDA" || currentuserrole === "PDA_MS"
          ? reportdata.data
              ?.filter(
                (field) =>
                  field.to_user.role == "PDA_JE" ||
                  field.from_user.role == "PDA_JE",
              )
              .map((field, index) => {
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
            })}
    </>
  );
};
