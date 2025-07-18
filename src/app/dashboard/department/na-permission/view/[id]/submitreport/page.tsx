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
import { SubmitReportEditor } from "@/components/editors/submitreporteditor/page";

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
  const userid = getCookie("id");

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
          className={`bg-white shadow rounded p-2 ${
            isNoting ? "col-span-6" : "col-span-12"
          }  flex flex-col`}
        >
          <div className="flex-1 flex flex-col">
            {formdata.data ? (
              <>
                <div className="flex items-center mb-2 gap-2">
                  <p className="text-lg font-semibold">Report</p>
                  <div className="grow"></div>
                  <button
                    onClick={() => setIsNoting(!isNoting)}
                    className="bg-blue-500 text-white px-4 py-1 rounded-md text-sm"
                  >
                    {isNoting ? "Close" : "Submit Report"}
                  </button>
                </div>
                <ReportPage id={formdata.data!.id} />
              </>
            ) : (
              <></>
            )}
          </div>
        </div>
        {isNoting && (
          <div
            className={`bg-white shadow rounded p-2 ${
              isNoting ? "col-span-6" : ""
            }`}
          >
            <SubmitReportEditor id={formdata.data!.id} />
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
            {roleToString(props.fromrole)} to {roleToString(props.torole)}
          </p>
          {/* <p className="text-sm leading-4 mt-1">{props.message}</p> */}
          <ViewEditor data={props.message} />
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
            {roleToString(props.fromrole)} to {roleToString(props.torole)}
          </p>
          {/* <p className="text-sm leading-4 mt-1 text-white">{props.message}</p> */}
          <ViewEditor data={props.message} />
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
            {/* {props.name} ({props.role}) */}
            {roleToString(props.fromrole)} to {roleToString(props.torole)}
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

interface ReportProviderProps {
  id: number;
}

const ReportPage = (props: ReportProviderProps) => {
  const userid = getCookie("id");
  const currentuserrole: string = getCookie("role") as string;

  const reportdata = useQuery({
    queryKey: ["getQueryByType", props.id],
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
            }
          })
        : reportdata.data?.map((field, index) => {
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
