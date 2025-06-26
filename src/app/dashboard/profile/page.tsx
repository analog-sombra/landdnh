"use client";
import { ApiCall } from "@/services/api";
import { useQuery } from "@tanstack/react-query";
import { getCookie } from "cookies-next/client";

const UserProfilePage = () => {
  const userid = getCookie("id");

  interface UserResponse {
    id: number;
    firstName: string;
    lastName: string;
    alias?: string | null;
    contact: string | null;
    contact_two?: string | null;
    role: string;
    address?: string | null;
    aadhar?: string | null;
    email?: string | null;
    village: {
      name: string;
    };
  }

  const userdata = useQuery({
    queryKey: ["naform"],
    refetchOnWindowFocus: false,
    queryFn: async () => {
      if (!userid) {
        return;
      }

      const response = await ApiCall({
        query:
          "query GetUserById($id: Int!) { getUserById(id: $id) {id, firstName, lastName, role, alias, contact, contact_two, address, aadhar, email, village { name }}}",
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
      <div className="p-4">
        <div className="p-4 bg-white rounded-md shadow-md w-80">
          {userdata.data && (
            <div>
              <p className="text-lg font-semibold mb-2 border-b border-gray-300">
                USER INFORMATION
              </p>
              <div className="bg-gray-100 p-2 rounded-md mt-1">
                <p className="text-gray-500 text-sm font-medium">Name</p>
                <p className="text-sm text-black leading-3">
                  {userdata.data.firstName} {userdata.data.lastName}
                </p>
              </div>
              <div className="bg-gray-100 p-2 rounded-md mt-1">
                <p className="text-gray-500 text-sm font-medium">Alias</p>
                <p className="text-sm text-black leading-3">
                  {userdata.data.alias || "N/A"}
                </p>
              </div>
              <div className="bg-gray-100 p-2 rounded-md mt-1">
                <p className="text-gray-500 text-sm font-medium">Contact</p>
                <p className="text-sm text-black leading-3">
                  {userdata.data.contact || "N/A"}
                </p>
              </div>
              <div className="bg-gray-100 p-2 rounded-md mt-1">
                <p className="text-gray-500 text-sm font-medium">Contact Two</p>
                <p className="text-sm text-black leading-3">
                  {userdata.data.contact_two || "N/A"}
                </p>
              </div>
              <div className="bg-gray-100 p-2 rounded-md mt-1">
                <p className="text-gray-500 text-sm font-medium">Email</p>
                <p className="text-sm text-black leading-3">
                  {userdata.data.email || "N/A"}
                </p>
              </div>

              <div className="bg-gray-100 p-2 rounded-md mt-1">
                <p className="text-gray-500 text-sm font-medium">Address</p>
                <p className="text-sm text-black leading-3">
                  {userdata.data.address || "N/A"}
                </p>
              </div>
              <div className="bg-gray-100 p-2 rounded-md mt-1">
                <p className="text-gray-500 text-sm font-medium">Aadhar</p>
                <p className="text-sm text-black leading-3">
                  {userdata.data.aadhar || "N/A"}
                </p>
              </div>
              <div className="bg-gray-100 p-2 rounded-md mt-1">
                <p className="text-gray-500 text-sm font-medium">Role</p>
                <p className="text-sm text-black leading-3">
                  {userdata.data.role}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
export default UserProfilePage;
