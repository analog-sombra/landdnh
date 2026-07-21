"use client";
import { ApiCall } from "@/services/api";
import { encryptURLData, formateDate } from "@/utils/methods";
import { useQuery } from "@tanstack/react-query";
import { Alert, Drawer, Pagination, Radio } from "antd";
import { CheckboxGroupProps } from "antd/es/checkbox";
import { getCookie } from "cookies-next/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

enum FILTERS {
  ALL = "All",
  MY_FILES = "My_Files",
  ESCALATION_FILES = "Escalation_Files",
}

const NaPermission = () => {
  const router = useRouter();
  // const [allFiles, setAllfiles] = useState<boolean>(false);
  const currentuserrole: string = getCookie("role") as string;

  const [pagination, setPaginatin] = useState<{
    take: number;
    skip: number;
    total: number;
  }>({
    take: 10,
    skip: 0,
    total: 0,
  });

  const [filter, setFilter] = useState<FILTERS>(FILTERS.MY_FILES);

  const [isInfo, setIsInfo] = useState<boolean>(false);

  const options: CheckboxGroupProps<string>["options"] = [
    { label: "My_Files", value: FILTERS.MY_FILES },
    { label: "All_Files", value: FILTERS.ALL },
    { label: "Escalation_Files", value: FILTERS.ESCALATION_FILES },
  ];

  interface NaResponse {
    limit: number;
    page: number;
    total: number;
    data: {
      id: number;
      q4: string;
      status: string;
      office_status: string;
      dept_status: string;
      form_status: string;
      updatedAt: string;
      dept_user: {
        role: string;
        id: number;
      };
      village: {
        name: string;
        talati_id: number;
        pda_id: number;
        mamlatar_id: number;
        ldc_mamlatar_id: number;
        dy_collector_id: number;
      };
    }[];
  }

  const naformdata = useQuery({
    queryKey: ["naform", pagination.skip, pagination.take],
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const response = await ApiCall({
        query:
          "query GetAllNa($take: Int!, $skip: Int!) { getAllNa(take: $take, skip: $skip) {total, skip, take, data {id, q4, status, form_status, office_status, dept_status, updatedAt, dept_user {role, id}, village {name, talati_id, pda_id, mamlatar_id, ldc_mamlatar_id, dy_collector_id}}}}",
        variables: {
          take: pagination.take,
          skip: pagination.skip,
        },
      });

      if (!response.status) {
        throw new Error(response.message);
      }

      // if value is not in response.data then return the error
      if (!(response.data as Record<string, unknown>)["getAllNa"]) {
        throw new Error("Value not found in response");
      }
      return (response.data as Record<string, unknown>)[
        "getAllNa"
      ] as NaResponse;
    },
  });

  const onChange = (page: number, pagesize: number) => {
    setPaginatin({
      ...pagination,
      skip: pagesize * (page - 1),
      take: pagesize,
    });
    naformdata.refetch();
  };

  if (naformdata.isLoading) {
    return <div>Loading...</div>;
  }

  if (naformdata.isError) {
    return <div>Error: {naformdata.error.message}</div>;
  }

  const filteredData = (): NaResponse["data"] => {
    if (naformdata.data == undefined) return [];
    if (FILTERS.ALL === filter) {
      if (currentuserrole == "COLLECTOR") {
        return naformdata.data.data.filter((val) => val.form_status != "DRAFT");
      } else if (currentuserrole == "DEPUTYCOLLECTOR") {
        return naformdata.data.data.filter(
          (val) =>
            val.form_status != "DRAFT" &&
            val.village.dy_collector_id == parseInt(getCookie("id") ?? "0"),
        );
      } else if (currentuserrole == "MAMLATDAR") {
        return naformdata.data.data.filter(
          (val) =>
            val.form_status != "DRAFT" &&
            val.village.mamlatar_id == parseInt(getCookie("id") ?? "0"),
        );
      } else if (currentuserrole == "LDCMAMLATDAR") {
        return naformdata.data.data.filter(
          (val) =>
            val.form_status != "DRAFT" &&
            val.village.ldc_mamlatar_id == parseInt(getCookie("id") ?? "0"),
        );
      }
      return naformdata.data.data.filter((val) => val.form_status != "DRAFT");
    } else if (FILTERS.MY_FILES === filter) {
      return naformdata.data.data.filter(
        (val) =>
          val.form_status != "DRAFT" &&
          (val.dept_user.id == parseInt(getCookie("id") as string) ||
            (val.dept_status == "SEEK_REPORT" &&
              ((currentuserrole == "TALATHI" &&
                val.village.talati_id == parseInt(getCookie("id") as string)) ||
                (currentuserrole == "PDA_JE" &&
                  val.village.pda_id == parseInt(getCookie("id") as string)) ||
                ["LAQ", "LRO", "DNHPDA","PDA_MS"].includes(currentuserrole)))),
      );
    } else {
      const date = new Date();

      return naformdata.data.data.filter(
        (val) =>
          val.form_status != "DRAFT" &&
          val.dept_status == "SEEK_REPORT" &&
          (date.getTime() - new Date(val.updatedAt).getTime()) /
            (1000 * 60 * 60 * 24) >
            15,
      );
    }
  };

  return (
    <div className="p-6">
      <div className="flex gap-2 items-center">
        <h1 className="text-[#162f57] text-2xl font-semibold">NA Permission</h1>
        <div className="grow"></div>
        {["LDCMAMLATDAR", "MAMLATDAR", "DEPUTYCOLLECTOR", "COLLECTOR"].includes(
          currentuserrole,
        ) && (
          <Radio.Group
            style={{ minWidth: 320 }}
            onChange={(e) => {
              const value = e.target.value;
              setFilter(value as FILTERS);
            }}
            block
            options={options}
            defaultValue={filter}
            optionType="button"
            buttonStyle="solid"
          />
        )}
      </div>

      {filteredData().length === 0 ? (
        <div className="mt-4">
          <Alert message="No Active Applications" type="warning" showIcon />
        </div>
      ) : (
        <>
          <div className="mt-2 p-4 bg-white rounded-md shadow-md">
            <div className="overflow-x-auto">
              <table className="w-full mt-2 border-collapse border border-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="border border-gray-300 px-4 py-2 text-left text-md font-normal">
                      Sr No.
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-left text-md font-normal">
                      Applicant Name
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-left text-md font-normal">
                      Village
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-left text-md font-normal">
                      Department
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-left text-md font-normal">
                      Status
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-left text-md font-normal">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <>
                    {filteredData().map((naform, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="border border-gray-300 px-4 py-2 font-normal text-sm">
                          {pagination.skip + index + 1}
                        </td>
                        <td className="border border-gray-300 px-4 py-2 font-normal text-sm">
                          {naform.q4}
                        </td>
                        <td className="border border-gray-300 px-4 py-2 font-normal text-sm">
                          {naform.village.name}
                        </td>
                        <td className="border border-gray-300 px-4 py-2 font-normal text-sm">
                          {naform.dept_user && naform.dept_user.role
                            ? naform.dept_user.role
                            : "N/A"}
                        </td>
                        <td className="border border-gray-300 px-4 py-2 font-normal text-sm">
                          {naform.dept_status}
                        </td>

                        <td className="border border-gray-300 px-4 py-2 font-normal text-sm flex gap-2">
                          <button
                            className="bg-blue-500 text-white px-4 py-1 rounded-md cursor-pointer"
                            onClick={() => {
                              router.push(
                                `/dashboard/department/na-permission/view/${encryptURLData(
                                  naform.id.toString(),
                                )}`,
                              );
                            }}
                          >
                            View
                          </button>

                          {filter == FILTERS.ESCALATION_FILES && (
                            <>
                              <button
                                className="bg-blue-500 text-white px-4 py-1 rounded-md cursor-pointer"
                                onClick={() => setIsInfo(true)}
                              >
                                Info
                              </button>
                            </>
                          )}

                          <Drawer
                            placement="right"
                            onClose={() => setIsInfo(false)}
                            open={isInfo}
                            closable={false}
                            // size="large"
                            styles={{
                              body: {
                                paddingLeft: "10px",
                                paddingRight: "10px",
                                paddingTop: "10px",
                                paddingBottom: "0px",
                                // backgroundColor: "#f4f8fb",
                              },
                            }}
                          >
                            <div>
                              <InfoPage
                                setIsInfo={setIsInfo}
                                isInfo={isInfo}
                                id={naform.id}
                              />
                            </div>
                          </Drawer>
                        </td>
                      </tr>
                    ))}
                  </>
                </tbody>
              </table>
            </div>
            <div className="mx-auto 500 grid place-items-center mt-2">
              <div className="lg:hidden">
                <Pagination
                  align="center"
                  defaultCurrent={1}
                  onChange={onChange}
                  showSizeChanger
                  total={filteredData().length}
                />
              </div>
              <div className="hidden lg:block">
                <Pagination
                  className="mt-2 mx-auto"
                  showTotal={(total, range) =>
                    `${range[0]}-${range[1]} of ${total} items`
                  }
                  showQuickJumper
                  defaultCurrent={1}
                  total={filteredData().length}
                  pageSizeOptions={[2, 5, 10, 20, 25, 50, 100]}
                  onChange={onChange}
                />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default NaPermission;

interface InfoProviderProps {
  id: number;
  setIsInfo: React.Dispatch<React.SetStateAction<boolean>>;
  isInfo: boolean;
}

interface ReportSubmitData {
  id: number;
  request_type: string;
  query_status: string;
  createdAt: Date;
  updatedAt: Date;
  type: string;
  from_user: {
    role: string;
  };
  to_user: {
    role: string;
  };
}

const InfoPage = (props: InfoProviderProps) => {
  const reportsubmitdata = useQuery({
    queryKey: ["reportReceivedStatus"],
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const response = await ApiCall({
        query:
          "query ReportReceivedStatus($id: Int!) { reportReceivedStatus(id: $id) { id, request_type,query_status,createdAt,updatedAt,type,from_user {role},to_user {role}}}",
        variables: {
          id: props.id,
        },
      });

      if (!response.status) {
        throw new Error(response.message);
      }

      // if value is not in response.data then return the error
      if (!(response.data as Record<string, unknown>)["reportReceivedStatus"]) {
        throw new Error("Value not found in response");
      }
      return (response.data as Record<string, unknown>)[
        "reportReceivedStatus"
      ] as ReportSubmitData[];
    },
  });

  if (reportsubmitdata.isLoading) {
    return <div>Loading...</div>;
  }

  if (reportsubmitdata.error) {
    return <div>Error: {reportsubmitdata.error.message}</div>;
  }

  return (
    <>
      <div>
        <div className="overflow-x-auto">
          <table className="w-full mt-2 border-collapse border border-gray-200">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-4 py-2 font-normal text-sm">
                  Dept.
                </th>
                <th className="border border-gray-300 px-4 py-2 font-normal text-sm">
                  Date Sent
                </th>
                <th className="border border-gray-300 px-4 py-2 font-normal text-sm">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {reportsubmitdata
                .data!.filter((item) => item.type === "REPORT")
                .map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="border border-gray-300 px-4 py-1 font-normal text-sm">
                      {item.to_user.role}
                    </td>
                    <td className="border border-gray-300 px-4 py-1 font-normal text-sm">
                      {formateDate(new Date(item.createdAt.toString()))}
                    </td>
                    <td className="border border-gray-300 px-4 py-1 font-normal text-sm">
                      {item.query_status === "PENDING"
                        ? "Not Received"
                        : item.query_status === "REPLIED"
                          ? (() => {
                              // Find the SUBMITREPORT with matching from_user and to_user
                              const submitReport = reportsubmitdata.data!.find(
                                (sr) =>
                                  sr.type === "SUBMITREPORT" &&
                                  sr.from_user.role === item.to_user.role &&
                                  sr.to_user.role === item.from_user.role,
                              );
                              return submitReport
                                ? `${formateDate(
                                    new Date(submitReport.createdAt.toString()),
                                  )}`
                                : "Received";
                            })()
                          : "Received"}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};
