"use client";

import Image from "next/image";
import {
  FluentMdl2ViewDashboard,
  FluentPower28Filled,
  FluentSignOut24Regular,
  FluentTaskListLtr20Regular,
  MaterialSymbolsKeyboardDoubleArrowRight,
  MaterialSymbolsPersonRounded,
} from "../icons";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { deleteCookie, getCookie } from "cookies-next/client";
import { useQuery } from "@tanstack/react-query";
import { ApiCall } from "@/services/api";
import { Popover } from "antd";

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (arg: boolean) => void;
}

const Sidebar = (props: SidebarProps) => {
  const path = usePathname();
  const router = useRouter();

  const userid = getCookie("id");

  interface UserResponse {
    id: number;
    firstName: string;
    lastName: string;
    role: string;
  }

  const userdata = useQuery({
    queryKey: ["getUserById"],
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

  if (userdata.isLoading) {
    return (
      <div className="w-full h-screen grid place-items-center">Loading...</div>
    );
  }

  if (userdata.isError) {
    return (
      <div className="w-full h-screen grid place-items-center">
        <p className="text-red-500">Error: {userdata.error.message}</p>
      </div>
    );
  }

  return (
    <>
      <div
        className={`w-60 h-screen top-0 left-0 fixed z-20 flex md:translate-x-0 bg-white md:bg-transparent ${
          props.isOpen ? "translate-x-0" : "-translate-x-full md:-translate-x-0"
        }`}
      >
        <div className="px-4 py-2 w-60 flex flex-col items-stretch">
          <div className="relative w-40 h-40 mx-auto">
            <Image
              fill={true}
              alt="logo"
              src={"/logo.png"}
              className="w-full h-full"
            />
          </div>
          <div className="h-6"></div>
          {userdata.data?.role === "USER" ? (
            <>
              <MenuTab
                name="Dashboard"
                path={path}
                pathcheck="/dashboard/user"
                click={() => props.setIsOpen(false)}
                icon={
                  <div className="bg-[#f3f6f8] rounded-lg">
                    <FluentMdl2ViewDashboard className="text-blue-500 w-6 h-6 p-1" />
                  </div>
                }
              />
              <MenuTab
                name="Service(s)"
                path={path}
                pathcheck="/dashboard/user/services"
                click={() => props.setIsOpen(false)}
                icon={
                  <div className="bg-[#f3f6f8] rounded-lg">
                    <FluentTaskListLtr20Regular className="text-blue-500 w-6 h-6 p-1" />
                  </div>
                }
              />
            </>
          ) : (
            <>
              <MenuTab
                name="NA Permission"
                path={path}
                pathcheck="/dashboard/department/na-permission"
                click={() => props.setIsOpen(false)}
                icon={
                  <div className="bg-[#f3f6f8] rounded-lg">
                    <FluentMdl2ViewDashboard className="text-blue-500 w-6 h-6 p-1" />
                  </div>
                }
              />
            </>
          )}

          <MenuTab
            name="Profile"
            path={path}
            pathcheck="/dashboard/profile"
            click={() => props.setIsOpen(false)}
            icon={
              <div className="bg-[#f3f6f8] rounded-lg">
                <MaterialSymbolsPersonRounded className="text-blue-500 w-6 h-6 p-1" />
              </div>
            }
          />
          <LogoutButton
            name="Logout"
            click={() => {
              props.setIsOpen(false);
              deleteCookie("id");
              deleteCookie("role");
              router.push("/login");
            }}
            icon={
              <div className="bg-[#f3f6f8] rounded-lg">
                <FluentPower28Filled className="text-blue-500 w-6 h-6 p-1" />
              </div>
            }
          />

          {/* <MenuTab
            name="Dashboard"
            path={path}
            pathcheck="/dashboard"
            click={() => props.setIsOpen(false)}
            icon={
              <div className="bg-[#f3f6f8] rounded-lg">
                <FluentMdl2ViewDashboard className="text-blue-500 w-6 h-6 p-1" />
              </div>
            }
          />
          <MenuTab
            name="Medical / Health"
            path={path}
            pathcheck="/dashboard/medical"
            click={() => props.setIsOpen(false)}
            icon={
              <div className="bg-[#f3f6f8] rounded-lg">
                <FluentShieldAdd48Filled className="text-blue-500 w-6 h-6 p-1" />
              </div>
            }
          />
          <MenuTab
            name="Market Place"
            path={path}
            pathcheck="/dashboard/marketplace"
            click={() => props.setIsOpen(false)}
            icon={
              <div className="bg-[#f3f6f8] rounded-lg">
                <FluentBuildingShop16Regular className="text-blue-500 w-6 h-6 p-1" />
              </div>
            }
          />
          <MenuTab
            name="Education"
            path={path}
            pathcheck="/dashboard/education"
            click={() => props.setIsOpen(false)}
            icon={
              <div className="bg-[#f3f6f8] rounded-lg">
                <FluentBuildingSkyscraper24Regular className="text-blue-500 w-6 h-6 p-1" />
              </div>
            }
          />
          <MenuTab
            name="Users"
            path={path}
            pathcheck="/dashboard/users"
            click={() => props.setIsOpen(false)}
            icon={
              <div className="bg-[#f3f6f8] rounded-lg">
                <MaterialSymbolsPersonRounded className="text-blue-500 w-6 h-6 p-1" />
              </div>
            }
          />
          <MenuTab
            name="Cow"
            path={path}
            pathcheck="/dashboard/cows"
            click={() => props.setIsOpen(false)}
            icon={
              <div className="bg-[#f3f6f8] rounded-lg">
                <IcBaselineAttractions className="text-blue-500 w-6 h-6 p-1" />
              </div>
            }
          />
          <MenuTab
            name="Reports"
            path={path}
            pathcheck="/reports"
            click={() => props.setIsOpen(false)}
            icon={
              <div className="bg-[#f3f6f8] rounded-lg">
                <FluentDocumentBulletList16Regular className="text-blue-500 w-6 h-6 p-1" />
              </div>
            }
          />
          <MenuTab
            name="Notifications"
            path={path}
            pathcheck="/notifications"
            click={() => props.setIsOpen(false)}
            icon={
              <div className="bg-[#f3f6f8] rounded-lg">
                <SolarBellBold className="text-blue-500 w-6 h-6 p-1" />
              </div>
            }
          /> */}
          <div className="grow"></div>
          <div className="bg-white p-1 rounded-md flex items-center shadow">
            <div className="relative w-7 h-7 rounded-full grid place-items-center bg-blue-500 text-white">
              {userdata.data!.firstName.at(0)?.toUpperCase()}
            </div>
            <div className="flex flex-col ml-2">
              <p className="text-sm font-semibold text-gray-700 leading-4">
                {userdata.data!.firstName} {userdata.data!.lastName}
              </p>
              <p className="text-xs font-normal text-gray-500">
                {userdata.data!.role}
              </p>
            </div>
            <div className="grow"></div>
            <Popover
              content={
                <div className="flex flex-col gap-2">
                  <button
                    className="flex gap-2 items-center cursor-pointer border border-blue-500 rounded p-1 w-40"
                    onClick={() => {
                      router.push("/dashboard/profile");
                    }}
                  >
                    <MaterialSymbolsPersonRounded className="text-blue-500 w-6 h-6" />
                    <p className="text-sm text-blue-500 font-normal">Profile</p>
                  </button>
                  <button
                    className="flex gap-2 items-center cursor-pointer border border-rose-500 rounded p-1 w-40"
                    onClick={() => {
                      deleteCookie("id");
                      deleteCookie("role");
                      router.push("/login");
                    }}
                  >
                    <FluentSignOut24Regular className="text-rose-500 w-6 h-6" />
                    <p className="text-sm text-rose-500 font-normal">Logout</p>
                  </button>
                </div>
              }
            >
              <div className="px-2">
                <MaterialSymbolsKeyboardDoubleArrowRight />
              </div>
            </Popover>
          </div>
        </div>
        <div className="w-[1px] bg-gray-400"></div>
      </div>
    </>
  );
};
export default Sidebar;

interface MenuTabProps {
  click: () => void;
  name: string;
  path: string;
  pathcheck: string;
  icon: React.ReactNode;
}

const MenuTab = (props: MenuTabProps) => {
  return (
    <Link
      onClick={props.click}
      href={props.pathcheck}
      className={` p-1 rounded-lg  flex gap-2 items-center my-1 ${
        props.path == props.pathcheck ? "bg-blue-500" : "border border-gray-300"
      }`}
    >
      {props.icon}
      <p
        className={`text-sm  ${
          props.path == props.pathcheck
            ? "text-white font-semibold"
            : "text-black font-normal"
        }`}
      >
        {props.name}
      </p>
    </Link>
  );
};

interface LogoutButtonProps {
  click: () => void;
  name: string;
  icon: React.ReactNode;
}

const LogoutButton = (props: LogoutButtonProps) => {
  return (
    <div
      onClick={props.click}
      className={`p-1 rounded-lg  flex gap-2 items-center my-1 border border-gray-300`}
    >
      {props.icon}
      <p className={`text-sm font-normal text-black}`}>{props.name}</p>
    </div>
  );
};
