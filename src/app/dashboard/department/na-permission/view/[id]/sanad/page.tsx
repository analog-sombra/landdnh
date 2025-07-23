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
import {
  decryptURLData,
  formatDateTime,
  formateDate,
  roleToString,
} from "@/utils/methods";
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
import { HearingEditor } from "@/components/editors/hearingtexteditor/page";
import { SanadEditor } from "@/components/editors/sanadtexteditor/page";
import { ShowEditor, UserChat } from "@/components/chat";

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
  const currentuserrole: string = getCookie("role") as string;
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
          {formdata.data ? <SanadEditor id={formdata.data.id} /> : <></>}
        </div>
        <div className="bg-white shadow rounded p-2 col-span-4">
          {/* <div className="flex items-center border-b pb-1 border-gray-300">
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
          )} */}
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
        //           return (
        //             <UserChat
        //               key={index}
        //               name={`${field.from_user.firstName} ${field.from_user.lastName}`}
        //               fromrole={field.from_user.role}
        //               torole={field.to_user.role}
        //               message={field.query}
        //               time={new Date(field.createdAt)}
        //               url={field.upload_url_1}
        //               type={field.type}
        //             />
        //           );
        //         } else {
        //           return (
        //             <DeptChat
        //               key={index}
        //               name={`${field.to_user.firstName} ${field.to_user.lastName}`}
        //               fromrole={field.from_user.role}
        //               torole={field.to_user.role}
        //               message={field.query}
        //               time={new Date(field.createdAt)}
        //               url={field.upload_url_1}
        //             />
        //           );
        //         }
      })}
    </>
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
              //   return (
              //     <UserChat
              //       key={index}
              //       name={`${field.from_user.firstName} ${field.from_user.lastName}`}
              //       fromrole={field.from_user.role}
              //       torole={field.to_user.role}
              //       message={field.query}
              //       time={new Date(field.createdAt)}
              //       url={field.upload_url_1}
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
            //   return (
            //     <UserChat
            //       key={index}
            //       name={`${field.from_user.firstName} ${field.from_user.lastName}`}
            //       fromrole={field.from_user.role}
            //       torole={field.to_user.role}
            //       message={field.query}
            //       time={new Date(field.createdAt)}
            //       url={field.upload_url_1}
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
            //     />
            //   );
            // }
          })}
    </>
  );
};
