"use client";
import { ApiCall } from "@/services/api";
import { departmentToString, encryptURLData, roleToString } from "@/utils/methods";
import { useQuery } from "@tanstack/react-query";
import { Alert, Pagination, Switch } from "antd";
import { getCookie } from "cookies-next/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

const NaPermission = () => {
  const router = useRouter();
  const [allFiles, setAllfiles] = useState<boolean>(false);
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

  //   const [search, setSearch] = useState<string | undefined>(undefined);

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
      dept_user: {
        role: string;
        id: number;
      };
      village: {
        name: string;
      };
    }[];
  }

  const naformdata = useQuery({
    queryKey: ["naform", pagination.skip, pagination.take],
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const response = await ApiCall({
        query:
          "query GetAllNa($take: Int!, $skip: Int!) { getAllNa(take: $take, skip: $skip) {total, skip, take, data {id, q4, status, form_status, office_status, dept_status, dept_user {role, id}, village {name}}}}",
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

  return (
    <div className="p-6">
      <div className="flex gap-2 items-center">
        <h1 className="text-[#162f57] text-2xl font-semibold">NA Permission</h1>
        <div className="grow"></div>
        {["LDCMAMLATDAR", "MAMLATDAR", "DEPUTYCOLLECTOR", "COLLECTOR"].includes(
          currentuserrole
        ) && (
          <Switch
            onChange={() => setAllfiles(!allFiles)}
            value={allFiles}
            checkedChildren="All Files"
            unCheckedChildren="My Files"
          />
        )}
      </div>

      {naformdata.data?.data.length === 0 ? (
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
                  {allFiles ? (
                    <>
                      {naformdata.data?.data
                        .filter((val) => val.form_status != "DRAFT")
                        .map((naform, index) => (
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

                            <td className="border border-gray-300 px-4 py-2 font-normal text-sm">
                              <button
                                className="bg-blue-500 text-white px-4 py-1 rounded-md cursor-pointer"
                                onClick={() => {
                                  router.push(
                                    `/dashboard/department/na-permission/view/${encryptURLData(
                                      naform.id.toString()
                                    )}`
                                  );
                                }}
                              >
                                View
                              </button>
                            </td>
                          </tr>
                        ))}
                    </>
                  ) : (
                    <>
                      {naformdata.data?.data
                        .filter(
                          (val) =>
                            val.form_status != "DRAFT" &&
                            (val.dept_user.id ==
                              parseInt(getCookie("id") as string) ||
                              (val.dept_status == "SEEK_REPORT" &&
                                ["TALATHI", "DNHPDA", "LAQ", "LRO"].includes(
                                  currentuserrole
                                )))
                        )
                        .map((naform, index) => (
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
                              {roleToString(naform.dept_user.role)}
                            </td>
                            <td className="border border-gray-300 px-4 py-2 font-normal text-sm">
                              {departmentToString(naform.dept_status)}
                            </td>

                            <td className="border border-gray-300 px-4 py-2 font-normal text-sm">
                              <button
                                className="bg-blue-500 text-white px-4 py-1 rounded-md cursor-pointer"
                                onClick={() => {
                                  router.push(
                                    `/dashboard/department/na-permission/view/${encryptURLData(
                                      naform.id.toString()
                                    )}`
                                  );
                                }}
                              >
                                View
                              </button>
                            </td>
                          </tr>
                        ))}
                    </>
                  )}
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
                  total={500}
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
                  total={
                    naformdata.data?.data.length ? naformdata.data?.total : 0
                  }
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
