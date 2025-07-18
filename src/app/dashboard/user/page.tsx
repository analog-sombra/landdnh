"use client";

import {
  FluentDocumentBulletList16Regular,
  IcBaselineAttractions,
  IcOutlineInfo,
  MaterialSymbolsPersonRounded,
} from "@/components/icons";
import { ApiCall } from "@/services/api";
import { useQuery } from "@tanstack/react-query";
import { Tooltip } from "antd";
import Link from "next/link";

const UserDashboardPage = () => {
  interface NaResponse {
    limit: number;
    page: number;
    total: number;
    data: {
      id: number;
      q4: string;
      status: string;
      office_status: string;
      form_status: string;
      dept_user: {
        role: string;
      };
      village: {
        name: string;
      };
    }[];
  }
  const naformdata = useQuery({
    queryKey: ["naform"],
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const response = await ApiCall({
        query:
          "query GetAllNa($take: Int!, $skip: Int!) { getAllNa(take: $take, skip: $skip) {total, skip, take, data {id, q4, status, form_status, office_status, dept_user {role}, village {name}}}}",
        variables: {
          take: 0,
          skip: 0,
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

  return (
    <>
      <div className="py-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 items-center px-4">
          <Link href="/dashboard/user/na-permission">
            <div className="flex-1 rounded-md bg-white p-4 relative">
              <div className="flex">
                <p className="text-sm">Non Agricultural Permission</p>
                <div className="grow"></div>
                <Tooltip title="Total number of Non Agricultural Permissions registered in the system">
                  <IcOutlineInfo />
                </Tooltip>
              </div>
              <div className="flex gap-2 items-center">
                <MaterialSymbolsPersonRounded />
                <p className="text-xl font-semibold">
                  {/* {dashboarddata.data?.user} */}
                  {naformdata.data?.total ?? 0}
                </p>
              </div>
              <p className="text-white bg-blue-500 absolute bottom-0 right-0 px-4 rounded-tl-lg rounded-br-lg">
                view
              </p>
            </div>
          </Link>

          <Link href="#">
            <div className="flex-1 rounded-md bg-white p-4 relative">
              <div className="flex">
                <p className="text-sm">Gift Permission</p>
                <div className="grow"></div>
                <Tooltip title="Total number of Gift Permissions registered in the system">
                  <IcOutlineInfo />
                </Tooltip>
              </div>
              <div className="flex gap-2 items-center">
                <IcBaselineAttractions />
                <p className="text-xl font-semibold">
                  {/* {dashboarddata.data?.cows} */}0
                </p>
              </div>
              <p className="text-white bg-blue-500 absolute bottom-0 right-0 px-4 rounded-tl-lg rounded-br-lg">
                view
              </p>
            </div>
          </Link>
          <Link href="#">
            <div className="flex-1 rounded-md bg-white p-4 relative">
              <div className="flex">
                <p className="text-sm">Partition Permission</p>
                <div className="grow"></div>
                <Tooltip title="Total number of Partition Permissions registered in the system">
                  <IcOutlineInfo />
                </Tooltip>
              </div>
              <div className="flex gap-2 items-center">
                <MaterialSymbolsPersonRounded />
                <p className="text-xl font-semibold">
                  {/* {dashboarddata.data?.venders} */}0
                </p>
              </div>
              <p className="text-white bg-blue-500 absolute bottom-0 right-0 px-4 rounded-tl-lg rounded-br-lg">
                view
              </p>
            </div>
          </Link>
          <Link href="#">
            <div className="flex-1 rounded-md bg-white p-4 relative">
              <div className="flex">
                <p className="text-sm">Sub Division Permission</p>
                <div className="grow"></div>
                <Tooltip title="Total number of Sub Division Permissions registered in the system">
                  <IcOutlineInfo />
                </Tooltip>
              </div>
              <div className="flex gap-2 items-center">
                <FluentDocumentBulletList16Regular />
                <p className="text-xl font-semibold">
                  {/* {dashboarddata.data?.medical} */}0
                </p>
              </div>
              <p className="text-white bg-blue-500 absolute bottom-0 right-0 px-4 rounded-tl-lg rounded-br-lg">
                view
              </p>
            </div>
          </Link>
          <Link href="#">
            <div className="flex-1 rounded-md bg-white p-4 relative">
              <div className="flex">
                <p className="text-sm">Sale Permission</p>
                <div className="grow"></div>
                <Tooltip title="Total number of Sale Permissions registered in the system">
                  <IcOutlineInfo />
                </Tooltip>
              </div>
              <div className="flex gap-2 items-center">
                <MaterialSymbolsPersonRounded />
                <p className="text-xl font-semibold">
                  {/* {dashboarddata.data?.user} */}0
                </p>
              </div>
              <p className="text-white bg-blue-500 absolute bottom-0 right-0 px-4 rounded-tl-lg rounded-br-lg">
                view
              </p>
            </div>
          </Link>

          <Link href="#">
            <div className="flex-1 rounded-md bg-white p-4 relative">
              <div className="flex">
                <p className="text-sm">Gift Permission</p>
                <div className="grow"></div>
                <Tooltip title="Total number of Gift Permissions registered in the system">
                  <IcOutlineInfo />
                </Tooltip>
              </div>
              <div className="flex gap-2 items-center">
                <IcBaselineAttractions />
                <p className="text-xl font-semibold">
                  {/* {dashboarddata.data?.cows} */}0
                </p>
              </div>
              <p className="text-white bg-blue-500 absolute bottom-0 right-0 px-4 rounded-tl-lg rounded-br-lg">
                view
              </p>
            </div>
          </Link>

          <Link href="#">
            <div className="flex-1 rounded-md bg-white p-4 relative">
              <div className="flex">
                <p className="text-sm">Exchange Permission</p>
                <div className="grow"></div>
                <Tooltip title="Total number of Exchange Permissions registered in the system">
                  <IcOutlineInfo />
                </Tooltip>
              </div>
              <div className="flex gap-2 items-center">
                <FluentDocumentBulletList16Regular />
                <p className="text-xl font-semibold">
                  {/* {dashboarddata.data?.medical} */}0
                </p>
              </div>
              <p className="text-white bg-blue-500 absolute bottom-0 right-0 px-4 rounded-tl-lg rounded-br-lg">
                view
              </p>
            </div>
          </Link>
          <Link href="#">
            <div className="flex-1 rounded-md bg-white p-4 relative">
              <div className="flex">
                <p className="text-sm">Sale NA Permission</p>
                <div className="grow"></div>
                <Tooltip title="Total number of Sale NA Permissions registered in the system">
                  <IcOutlineInfo />
                </Tooltip>
              </div>
              <div className="flex gap-2 items-center">
                <MaterialSymbolsPersonRounded />
                <p className="text-xl font-semibold">
                  {/* {dashboarddata.data?.venders} */}0
                </p>
              </div>
              <p className="text-white bg-blue-500 absolute bottom-0 right-0 px-4 rounded-tl-lg rounded-br-lg">
                view
              </p>
            </div>
          </Link>
        </div>
      </div>
    </>
  );
};

export default UserDashboardPage;
