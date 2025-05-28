"use client";
import { TaxtAreaInput } from "@/components/form/inputfields/textareainput";
import { QueryForm, QuerySchema } from "@/schema/forms/query";
import { ApiCall, UploadFile } from "@/services/api";
import { baseurl } from "@/utils/const";
import { decryptURLData, formatDateTime, onFormError } from "@/utils/methods";
import { na_downmark, na_upmark } from "@/utils/permissionpage";
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

interface UserResponseData {
  id: number;
  firstName: string;
  lastName: string;
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
          "query GetNaById($id:Int!) { getNaById(id: $id) { id, q1, q2, q3, q4, anx1, anx2, anx3, anx4, anx5, q4, q5, q6, q7, q8, q9, q10, q11, q12, q13, q14, q15, q16, q17, q18, createdById, village{ id, name }, na_applicant { firstName, lastName, contact,relation, signature_url }, na_survey { area, sub_division, survey_no, village { name }}}}",
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

  const [upmarkBox, setUpmarkBox] = useState(false);
  const [downmarkBox, setDownmarkBox] = useState(false);
  const [userBox, setUserBox] = useState(false);

  const [correspondenceBox, setCorrespondenceBox] = useState(false);
  const [notingBox, setNotingBox] = useState(false);

  if (formdata.isLoading) {
    return <div>Loading...</div>;
  }

  if (formdata.isError) {
    return <div>Error: {formdata.error.message}</div>;
  }

  return (
    <div className="py-4">
      <h1 className="text-[#162f57] text-2xl font-semibold  mx-4">
        View NA Permission
      </h1>
      <div className="flex gap-2 items-center mt-4">
        <div className="grow"></div>

        <button
          onClick={() => setCorrespondenceBox(true)}
          className="bg-[#162f57] text-white py-1 px-4 rounded-md text-sm grid place-items-center cursor-pointer"
        >
          Correspondence
        </button>
        <button
          onClick={() => setNotingBox(true)}
          className="bg-[#162f57] text-white py-1 px-4 rounded-md text-sm grid place-items-center cursor-pointer"
        >
          Notings
        </button>

        <button
          className="bg-[#162f57] text-white py-1 px-4 rounded-md text-sm grid place-items-center cursor-pointer"
          onClick={() => setUpmarkBox(true)}
        >
          Upmark
        </button>

        <button
          className="bg-[#162f57] text-white py-1 px-4 rounded-md text-sm grid place-items-center cursor-pointer"
          onClick={() => setDownmarkBox(true)}
        >
          Downmark
        </button>
        <button className="bg-[#162f57] text-white py-1 px-4 rounded-md text-sm grid place-items-center cursor-pointer">
          Submit Report
        </button>
        <button className="bg-[#162f57] text-white py-1 px-4 rounded-md text-sm grid place-items-center cursor-pointer">
          Seek Report
        </button>
        <div className="w-2"></div>
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
            1. Full Name of the Applicant.
          </p>
          <div className="flex-1">{formdata.data!.q4}</div>
        </div>

        <div className="flex gap-8 border-b border-gray-200 pb-2 mb-2 px-16">
          <p className="flex-1 text-sm text-gray-500">
            2. Full Postal Address.
          </p>
          <div className="flex-1">{formdata.data!.q5}</div>
        </div>
        <div className="flex gap-8 border-b border-gray-200 pb-2 mb-2 px-16">
          <p className="flex-1 text-sm text-gray-500">
            3. Contact no of the applicant.
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
          <p className="flex-1 text-sm text-gray-500">(4) Village</p>
          <div className="flex-1">{formdata.data!.village.name}</div>
        </div>
        <div className="flex gap-8 border-b border-gray-200 pb-2 mb-2 px-16">
          <p className="flex-1 text-sm text-gray-500">(5) Survey No</p>
          <div className="flex-1">{formdata.data!.q7}</div>
        </div>
        <div className="flex gap-8 border-b border-gray-200 pb-2 mb-2 px-16">
          <p className="flex-1 text-sm text-gray-500">(6) Sub Division</p>
          <div className="flex-1">{formdata.data!.q8}</div>
        </div>

        <div className="flex gap-8 border-b border-gray-200 pb-2 mb-2 px-16">
          <p className="flex-1 text-sm text-gray-500">(7) Area in Sq.mt.</p>
          <div className="flex-1">{formdata.data!.q9}</div>
        </div>
        <div className="flex gap-8 border-b border-gray-200 pb-2 mb-2 px-16">
          <p className="flex-1 text-sm text-gray-500">(8) Old Survey No</p>
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
            (9) Area of the site out of (5) above to be used for.
          </p>
          <div className="flex-1">{formdata.data!.q11}</div>
        </div>
        <div className="flex gap-8 border-b border-gray-200 pb-2 mb-2 px-16">
          <p className="flex-1 text-sm text-gray-500">
            (10) Type (Residential/Commercial/Industrial)
          </p>
          <div className="flex-1">{formdata.data!.q12}</div>
        </div>
        <div className="flex gap-8 border-b border-gray-200 pb-2 mb-2 px-16">
          <p className="flex-1 text-sm text-gray-500">
            (11) Present use of the land and whether any building exists thereon
            and if so, iti use.
          </p>
          <div className="flex-1">{formdata.data!.q13}</div>
        </div>
        <div className="flex gap-8 border-b border-gray-200 pb-2 mb-2 px-16">
          <p className="flex-1 text-sm text-gray-500">
            (12) Whether electrical light transmission lines pass over tle land
            and if so, the distance thereof from the proposed building other
            works.
          </p>
          <div className="flex-1">{formdata.data!.q14}</div>
        </div>
        <div className="flex gap-8 border-b border-gray-200 pb-2 mb-2 px-16">
          <p className="flex-1 text-sm text-gray-500">
            (13) Is, the land under acquisition ..If so, state details.
          </p>
          <div className="flex-1">{formdata.data!.q15}</div>
        </div>
        <div className="flex gap-8 border-b border-gray-200 pb-2 mb-2 px-16">
          <p className="flex-1 text-sm text-gray-500">
            (14) Is there a road from where the land is easily accessible ?
            State the name of the road and whether it is Highway, Major district
            road or village road. What is the distance of the proposed building
            or other work from the ienter ofthe road.
          </p>
          <div className="flex-1">{formdata.data!.q16}</div>
        </div>
        <div className="flex gap-8 border-b border-gray-200 pb-2 mb-2 px-16">
          <p className="flex-1 text-sm text-gray-500">
            (15) If there is no road adjoining the land, how is it proposed to
            be provided for access to the site.
          </p>
          <div className="flex-1">{formdata.data!.q17}</div>
        </div>
        <div className="flex gap-8 border-b border-gray-200 pb-2 mb-2 px-16">
          <p className="flex-1 text-sm text-gray-500">
            (16) Was a similar application made in the past for non-agricultural
            use of this land and was it rejected If yes, give details.
          </p>
          <div className="flex-1">{formdata.data!.q18}</div>
        </div>
      </div>

      <Drawer
        placement="right"
        onClose={() => setUpmarkBox(false)}
        open={upmarkBox}
        closable={false}
        width={400}
        className="bg-white"
      >
        <div>
          <h1 className="text-lg font-semibold">Notings</h1>
          <UpmarkProvider
            setUpmarkBox={setUpmarkBox}
            setUserBox={setUserBox}
            userBox={userBox}
            id={formdata.data!.id}
          />
        </div>
      </Drawer>
      <Drawer
        placement="right"
        onClose={() => setDownmarkBox(false)}
        open={downmarkBox}
        closable={false}
        width={400}
        className="bg-white"
      >
        <div>
          <h1 className="text-lg font-semibold">Notings</h1>
          <DownmarkProvider
            setDownmarkBox={setDownmarkBox}
            setUserBox={setUserBox}
            userBox={userBox}
            id={formdata.data!.id}
          />
        </div>
      </Drawer>
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
    </div>
  );
};

export default ViewPermission;

interface UpmarkProviderProps {
  setUpmarkBox: React.Dispatch<React.SetStateAction<boolean>>;
  setUserBox: React.Dispatch<React.SetStateAction<boolean>>;
  userBox: boolean;
  id: number;
}

const UpmarkProvider = (props: UpmarkProviderProps) => {
  const methods = useForm<QueryForm>({
    resolver: valibotResolver(QuerySchema),
  });

  return (
    <>
      <FormProvider {...methods}>
        <UpmarkPage
          setUpmarkBox={props.setUpmarkBox}
          setUserBox={props.setUserBox}
          userBox={props.userBox}
          id={props.id}
        />
      </FormProvider>
    </>
  );
};

const UpmarkPage = (props: UpmarkProviderProps) => {
  const userid = getCookie("id");
  const role = getCookie("role") as keyof typeof na_upmark;

  const userdata = useMutation({
    mutationKey: ["getUserByRole"],
    mutationFn: async (data: { role: string }) => {
      const response = await ApiCall({
        query:
          "query GetUserByRole($role: Role!) { getUserByRole(role: $role) { id, firstName, lastName }}",
        variables: {
          role: data.role,
        },
      });

      if (!response.status) {
        throw new Error(response.message);
      }

      if (!(response.data as Record<string, unknown>)["getUserByRole"]) {
        throw new Error("Value not found in response");
      }
      return (response.data as Record<string, unknown>)[
        "getUserByRole"
      ] as UserResponseData[];
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const createquery = useMutation({
    mutationKey: ["createNaQuery"],
    mutationFn: async (id: number) => {
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
            to_userId: id,
            query: getValues("query"),
            type: "NOTING",
            na_formId: props.id,
            query_status: "PENDING",
            request_type: "DEPTTODEPT",
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
    props.setUserBox(true);

    const getrole = na_upmark[role];
    if (!getrole) {
      toast.error("Role not found");
      return;
    }
    userdata.mutate({
      role: getrole,
    });
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
              {/* <p className="text-sm text-gray-700">{anx1.name}</p> */}
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

      <Drawer
        width={320}
        closable={false}
        onClose={() => props.setUserBox(false)}
        open={props.userBox}
        styles={{
          body: {
            paddingLeft: "10px",
            paddingRight: "10px",
            paddingTop: "10px",
            paddingBottom: "0px",
          },
        }}
      >
        <h1 className="text-lg font-semibold text-[#162f57] mb-2">Mark to</h1>
        {userdata.data?.map((field, index) => (
          <div
            className="flex gap-2 bg-gray-100 p-2 rounded items-center"
            key={index}
          >
            <h2 className="text-sm font-medium text-gray-700">
              {field.firstName} {field.lastName}
            </h2>
            <div className="grow"></div>
            <button
              className="bg-[#162f57] text-white py-1 px-4 rounded-md text-sm"
              onClick={() => {
                createquery.mutate(field.id);
                props.setUserBox(false);
                props.setUpmarkBox(false);
              }}
            >
              Submit
            </button>
          </div>
        ))}
      </Drawer>
    </>
  );
};

interface DownmarkProviderProps {
  setDownmarkBox: React.Dispatch<React.SetStateAction<boolean>>;
  setUserBox: React.Dispatch<React.SetStateAction<boolean>>;
  userBox: boolean;
  id: number;
}

const DownmarkProvider = (props: DownmarkProviderProps) => {
  const methods = useForm<QueryForm>({
    resolver: valibotResolver(QuerySchema),
  });

  return (
    <>
      <FormProvider {...methods}>
        <DownmarkPage
          setDownmarkBox={props.setDownmarkBox}
          setUserBox={props.setUserBox}
          userBox={props.userBox}
          id={props.id}
        />
      </FormProvider>
    </>
  );
};

const DownmarkPage = (props: DownmarkProviderProps) => {
  const userid = getCookie("id");
  const role = getCookie("role") as keyof typeof na_downmark;

  const userdata = useMutation({
    mutationKey: ["getUserByRole"],
    mutationFn: async (data: { role: string }) => {
      const response = await ApiCall({
        query:
          "query GetUserByRole($role: Role!) { getUserByRole(role: $role) { id, firstName, lastName }}",
        variables: {
          role: data.role,
        },
      });

      if (!response.status) {
        throw new Error(response.message);
      }

      if (!(response.data as Record<string, unknown>)["getUserByRole"]) {
        throw new Error("Value not found in response");
      }
      return (response.data as Record<string, unknown>)[
        "getUserByRole"
      ] as UserResponseData[];
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const createquery = useMutation({
    mutationKey: ["createNaQuery"],
    mutationFn: async (id: number) => {
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
            to_userId: id,
            query: getValues("query"),
            type: "NOTING",
            na_formId: props.id,
            query_status: "PENDING",
            request_type: "DEPTTODEPT",
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
    props.setUserBox(true);

    const getrole = na_downmark[role];
    if (!getrole) {
      toast.error("Role not found");
      return;
    }
    userdata.mutate({
      role: getrole,
    });
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
              {/* <p className="text-sm text-gray-700">{anx1.name}</p> */}
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

      <Drawer
        // title="Select User"
        width={320}
        closable={false}
        onClose={() => props.setUserBox(false)}
        open={props.userBox}
        styles={{
          body: {
            paddingLeft: "10px",
            paddingRight: "10px",
            paddingTop: "10px",
            paddingBottom: "0px",
          },
        }}
      >
        <h1 className="text-lg font-semibold text-[#162f57] mb-2">Mark to</h1>
        {userdata.data?.map((field, index) => (
          <div
            className="flex gap-2 bg-gray-100 p-2 rounded items-center"
            key={index}
          >
            <h2 className="text-sm font-medium text-gray-700">
              {field.firstName} {field.lastName}
            </h2>
            <div className="grow"></div>
            <button
              className="bg-[#162f57] text-white py-1 px-4 rounded-md text-sm"
              onClick={() => {
                createquery.mutate(field.id);
                props.setUserBox(false);
                props.setDownmarkBox(false);
              }}
            >
              Submit
            </button>
          </div>
        ))}
      </Drawer>
    </>
  );
};

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
            to_userId: props.createdById,
            query: getValues("query"),
            type: "QUERY",
            na_formId: props.id,
            query_status: "PENDING",
            request_type: "DEPTTOAPPL",
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
    // props.setUserBox(true);

    // const getrole = na_downmark[role];
    // if (!getrole) {
    //   toast.error("Role not found");
    //   return;
    // }
    // userdata.mutate({
    //   role: getrole,
    // });
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
        <p className="text-gray-700 text-lg ">Correspondence</p>
        <div className="grow"></div>
        <button
          type="button"
          onClick={() => setQueryBox(true)}
          className="py-1 rounded-md bg-blue-500 px-4 text-sm text-white cursor-pointer w-28 text-nowrap"
        >
          Add Query
        </button>
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
              role={field.from_user.role}
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
              role={field.to_user.role}
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
        {/* {userdata.data?.map((field, index) => (
          <div
            className="flex gap-2 bg-gray-100 p-2 rounded items-center"
            key={index}
          >
            <h2 className="text-sm font-medium text-gray-700">
              {field.firstName} {field.lastName}
            </h2>
            <div className="grow"></div>
            <button
              className="bg-[#162f57] text-white py-1 px-4 rounded-md text-sm"
              onClick={() => {
                createquery.mutate(field.id);
                props.setUserBox(false);
                props.setQueryBox(false);
              }}
            >
              Submit
            </button>
          </div>
        ))} */}
      </Drawer>
    </>
  );
};

interface DeptChatProps {
  name: string;
  role: string;
  message: string;
  time: Date;
  url?: string | null;
}

const DeptChat = (props: DeptChatProps) => {
  return (
    <div className="mt-4">
      <div className="flex items-center gap-1 max-w-5/6">
        <div className="shrink-0 h-8 w-8 rounded-full bg-rose-500 grid place-items-center text-lg text-white font-semibold">
          {props.name.charAt(0).toUpperCase()}
        </div>
        <div className="px-2 py-1 bg-gray-100 rounded-md pb-2 my-1">
          <p className="text-sm text-gray-500 border-b pb-1">
            {props.name} ({props.role})
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
  role: string;
  message: string;
  time: Date;
  url?: string | null;
}

const UserChat = (props: UserChatProps) => {
  return (
    <div className="mt-4 flex items-end flex-col">
      <div className="flex items-center gap-1 max-w-5/6">
        <div className="px-2 py-1 bg-gray-100 rounded-md pb-2 my-1">
          <p className="text-sm text-gray-500 border-b pb-1">
            {props.name} ({props.role})
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
        <div className="shrink-0 h-8 w-8 rounded-full bg-rose-500 grid place-items-center text-lg text-white font-semibold">
          {props.name.charAt(0).toUpperCase()}
        </div>
      </div>
      <p className="text-xs text-left text-gray-500 leading-2 max-w-5/6 pr-9">
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
  const methods = useForm<QueryForm>({
    resolver: valibotResolver(QuerySchema),
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
  const notingdata = useQuery({
    queryKey: ["getQueryByType", props.id],
    queryFn: async () => {
      const response = await ApiCall({
        query:
          "query GetQueryByType($id: Int!, $querytype: [QueryType!]!) {getQueryByType(id: $id, querytype: $querytype) {id,query,upload_url_1,type,request_type,createdAt,from_user {firstName,lastName,role},to_user {firstName,lastName,role},}}",
        variables: {
          id: props.id,
          querytype: ["NOTING"],
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

      {notingdata.data?.map((field, index) => {
        if (field.from_user.role === "USER") {
          return (
            <UserChat
              key={index}
              name={`${field.from_user.firstName} ${field.from_user.lastName}`}
              role={field.from_user.role}
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
              role={field.to_user.role}
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
