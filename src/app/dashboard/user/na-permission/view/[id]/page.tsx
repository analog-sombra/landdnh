"use client";
import { TaxtAreaInput } from "@/components/form/inputfields/textareainput";
import { TextInput } from "@/components/form/inputfields/textinput";
import { FeesForm, FeesSchema } from "@/schema/forms/fees";
import { QueryForm, QuerySchema } from "@/schema/forms/query";
import { ApiCall, UploadFile } from "@/services/api";
import { baseurl } from "@/utils/const";
import { decryptURLData, formatDateTime, onFormError } from "@/utils/methods";
import { mamlatdarid } from "@/utils/permissionpage";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Alert, Drawer } from "antd";
import { getCookie } from "cookies-next/client";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import { toast } from "react-toastify";

interface NaFormResponse {
  id: number;
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
    firstName: string;
    lastName: string;
    role: string;
  };
  to_user: {
    firstName: string;
    lastName: string;
    role: string;
  };
}

const ViewPermission = () => {
  const router = useRouter();
  const { id } = useParams<{ id: string | string[] }>();
  const idString = Array.isArray(id) ? id[0] : id;
  const formid: number = parseInt(decryptURLData(idString, router));

  const formdata = useQuery({
    queryKey: ["getnaform", formid],
    queryFn: async () => {
      const response = await ApiCall({
        query:
          "query GetNaById($id:Int!) { getNaById(id: $id) { id, last_name, q1, q2, q3, q4, anx1, anx2, anx3, anx4, anx5, q4, q5, q6, q7, q8, q9, q10, q11, q12, q13, q14, q15, q16, q17, q18, createdById, village{ id, name }, na_applicant { firstName, lastName, contact,relation, signature_url }, na_survey { area, sub_division, survey_no, village { name }}}}",
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

  const [correspondenceBox, setCorrespondenceBox] = useState(false);

  const [paymentHistoryBox, setPaymentHistoryBox] = useState(false);
  const [feesBox, setFeesBox] = useState(false);

  if (formdata.isLoading) {
    return <div>Loading...</div>;
  }

  if (formdata.isError) {
    return <div>Error: {formdata.error.message}</div>;
  }

  return (
    <div className="py-4">
      <div className="flex gap-2 items-center px-4">
        <h1 className="text-[#162f57] text-2xl font-semibold mx-4">
          View NA Permission
        </h1>
        <div className="grow"></div>
        <button
          onClick={() => setCorrespondenceBox(true)}
          className="bg-[#162f57] text-white py-1 px-4 rounded-md text-sm grid place-items-center cursor-pointer"
        >
          View Query
        </button>
        <button
          onClick={() => setPaymentHistoryBox(true)}
          className="bg-[#162f57] text-white py-1 px-4 rounded-md text-sm grid place-items-center cursor-pointer"
        >
          Payment History
        </button>
      </div>

      <div className="p-4 bg-white rounded-md shadow-md m-4">
        <h1 className="mx-4 text-lg text-center font-semibold mt-4">
          F O R M - V I I
        </h1>
        <h1 className="text-lg text-center font-semibold leading-3">
          (See Rule 46)
        </h1>
        <p className="mx-4 text-xs text-left mt-2">
          Form of application under Sub-section (1) of Section 42 of the Dadra
          and Nagar Haveli. Land Revenue Administration Regulation, 1971.
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
          <span className="font-semibold">NA OF LAND</span> for which details
          are given below :-
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
            relaxation of condition on the time of grant of land or permission
            for such non-agricultural use Viz
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
                      className="bg-gray-200 text-black py-1 px-4 rounded-md text-sm h-8 grid place-items-center"
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
            (12) Present use of the land and whether any building exists thereon
            and if so, it's use.
          </p>
          <div className="flex-1">{formdata.data!.q13}</div>
        </div>
        <div className="flex gap-8 border-b border-gray-200 pb-2 mb-2 px-16">
          <p className="flex-1 text-sm text-gray-500">
            (13) Whether electrical light transmission lines pass over tle land
            and if so, the distance thereof from the proposed building other
            works.
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
            State the name of the road and whether it is Highway, Major district
            road or village road. What is the distance of the proposed building
            or other work from the center of the road.
          </p>
          <div className="flex-1">{formdata.data!.q16}</div>
        </div>
        <div className="flex gap-8 border-b border-gray-200 pb-2 mb-2 px-16">
          <p className="flex-1 text-sm text-gray-500">
            (16) If there is no road adjoining the land, how is it proposed to
            be provided for access to the site.
          </p>
          <div className="flex-1">{formdata.data!.q17}</div>
        </div>
        <div className="flex gap-8 border-b border-gray-200 pb-2 mb-2 px-16">
          <p className="flex-1 text-sm text-gray-500">
            (17) Was a similar application made in the past for non-agricultural
            use of this land and was it rejected If yes, give details.
          </p>
          <div className="flex-1">{formdata.data!.q18}</div>
        </div>
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
            setFeesBox={setFeesBox}
            feesBox={feesBox}
            id={formdata.data!.id}
          />
        </div>
      </Drawer>
    </div>
  );
};

export default ViewPermission;

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
  const userid = getCookie("id");
  const [queryBox, setQueryBox] = useState(false);

  const chatdata = useQuery({
    queryKey: ["getQueryByType", props.id],
    queryFn: async () => {
      const response = await ApiCall({
        query:
          "query GetQueryByType($id: Int!, $querytype: [QueryType!]!) {getQueryByType(id: $id, querytype: $querytype) {id,query,upload_url_1,type,request_type,createdAt,from_user {firstName,lastName,role},to_user {firstName,lastName,role},}}",
        variables: {
          id: props.id,
          querytype: ["QUERY"],
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

  const createquery = useMutation({
    mutationKey: ["createNaQuery"],
    mutationFn: async () => {
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
            to_userId: mamlatdarid,
            query: getValues("query"),
            type: "QUERY",
            na_formId: props.id,
            query_status: "PENDING",
            request_type: "APPLTODEPT",
            ...(getValues("upload_url_1") && {
              upload_url_1: getValues("upload_url_1"),
            }),
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
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    setValue,
    getValues,
  } = useFormContext<QueryForm>();

  const uploadRef = useRef<HTMLInputElement>(null);
  const [upload, setUpload] = useState<File | null>(null);

  const onSubmit = async () => {
    setQueryBox(false);

    createquery.mutate();
  };

  const handleFileUpload = (ref: React.RefObject<HTMLInputElement | null>) => {
    if (ref!.current) {
      ref!.current.click();
    }
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
    setFile: React.Dispatch<React.SetStateAction<File | null>>,
    ref: React.RefObject<HTMLInputElement | null>
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

  return (
    <>
      <div className="flex items-center gap-2">
        <p className="text-gray-700 text-lg ">Query</p>
        <div className="grow"></div>
        {chatdata.data && chatdata.data?.length > 0 && (
          <button
            type="button"
            onClick={() => setQueryBox(true)}
            className="py-1 rounded-md bg-blue-500 px-4 text-sm text-white cursor-pointer w-28 text-nowrap"
          >
            Reply to Query
          </button>
        )}
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

      {chatdata.data
        ?.filter((val) => val.request_type == "APPLTODEPT")
        .map((field, index) => {
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
                fromrole={field.to_user.role}
                torole={field.from_user.role}
                message={field.query}
                time={new Date(field.createdAt)}
                url={field.upload_url_1}
              />
            );
          }
        })}

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
        <h1 className="text-lg font-semibold text-[#162f57] mb-2">Query</h1>
        <form onSubmit={handleSubmit(onSubmit, onFormError)}>
          <div>
            <TaxtAreaInput<QueryForm>
              title="Query"
              required={true}
              name="query"
              placeholder="Enter Details"
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
              onChange={(e) => handleFileChange(e, setUpload, uploadRef)}
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
              className="text-left text-sm text-nowrap inline-block"
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
            {/* {props.name} ({props.role}) */}
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
  setFeesBox: React.Dispatch<React.SetStateAction<boolean>>;
  feesBox: boolean;
  id: number;
}

const PaymentHistoryProvider = (props: PaymentHistoryProviderProps) => {
  const methods = useForm<FeesForm>({
    resolver: valibotResolver(FeesSchema),
  });

  return (
    <>
      <FormProvider {...methods}>
        <PaymentHistoryPage
          setPaymentHistoryBox={props.setPaymentHistoryBox}
          setFeesBox={props.setFeesBox}
          feesBox={props.feesBox}
          id={props.id}
        />
      </FormProvider>
    </>
  );
};

const PaymentHistoryPage = (props: PaymentHistoryProviderProps) => {
  const userid = getCookie("id");
  const [feesId, setFeesId] = useState<number>(0);

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

  const payfees = useMutation({
    mutationKey: ["createNaFee"],
    mutationFn: async () => {
      if (!userid) {
        toast.error("User ID not found");
        return;
      }

      if (feesId === 0) {
        toast.error("Fees ID not set");
        return;
      }

      const response = await ApiCall({
        query:
          "mutation PayNaFee($updateNaFeeInput: UpdateNaFeeInput!) {payNaFee(updateNaFeeInput: $updateNaFeeInput) {id}}",
        variables: {
          updateNaFeeInput: {
            updatedById: parseInt(userid.toString()),
            id: feesId,
            order_id: getValues("order_id"),
            track_id: getValues("track_id"),
            transaction_id: getValues("transaction_id"),
          },
        },
      });

      if (!response.status) {
        throw new Error(response.message);
      }

      if (!(response.data as Record<string, unknown>)["payNaFee"]) {
        throw new Error("Value not found in response");
      }
      return (response.data as Record<string, unknown>)[
        "payNaFee"
      ] as QueryResponseData;
    },
    onError: (error) => {
      toast.error(error.message);
    },
    onSuccess: () => {
      toast.success("Payment successful");
      paymenthistorydata.refetch();
    },
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
    setValue,
    getValues,
  } = useFormContext<FeesForm>();

  const onSubmit = async () => {
    payfees.mutate();
    props.setFeesBox(false);
    await paymenthistorydata.refetch();
  };

  if (paymenthistorydata.isLoading) {
    return (
      <>
        <p className="text-gray-500 text-center">Loading payment history...</p>
      </>
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
          <div className="flex items-center gap-2 border-b border-gray-300 pb-1">
            <p className="text-sm text-white">Purpose</p>
            <div className="grow"></div>
            {!field.is_paid && (
              <button
                className="py-1 rounded-md  px-4 text-xs text-white cursor-pointer"
                onClick={() => {
                  props.setFeesBox(true);
                  setFeesId(field.id);
                  setValue("order_id", "");
                  setValue("transaction_id", "");
                  setValue("track_id", "");
                }}
              >
                Pay fees
              </button>
            )}
          </div>

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

      <Drawer
        width={320}
        closable={false}
        onClose={() => props.setFeesBox(false)}
        open={props.feesBox}
        styles={{
          body: {
            paddingLeft: "10px",
            paddingRight: "10px",
            paddingTop: "10px",
            paddingBottom: "0px",
          },
        }}
      >
        <h1 className="text-lg font-semibold text-[#162f57] mb-2">Pay Fees</h1>
        <form onSubmit={handleSubmit(onSubmit, onFormError)}>
          <div>
            <TextInput<FeesForm>
              title="Order ID"
              required={true}
              name="order_id"
              placeholder="Enter Order ID"
            />
          </div>
          <div>
            <TextInput<FeesForm>
              title="Transaction ID"
              required={true}
              name="transaction_id"
              placeholder="Enter Transaction ID"
            />
          </div>

          <div>
            <TextInput<FeesForm>
              title="Track ID"
              required={true}
              name="track_id"
              placeholder="Enter Track ID"
            />
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
  );
};
