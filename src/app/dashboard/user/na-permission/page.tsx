"use client";
import { MaterialSymbolsLightAdd } from "@/components/icons";
import { ApiCall } from "@/services/api";
import { encryptURLData } from "@/utils/methods";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Alert, Pagination, Modal, Dropdown } from "antd";
import { getCookie } from "cookies-next/client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

const NaPermission = () => {
  const userid = getCookie("id");

  const router = useRouter();
  const [pagination, setPaginatin] = useState<{
    take: number;
    skip: number;
    total: number;
  }>({
    take: 10,
    skip: 0,
    total: 0,
  });

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteData, setDeleteData] = useState<{ id: number; name: string } | null>(null);


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
    queryKey: ["getAllUserNa", pagination.skip, pagination.take],
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const response = await ApiCall({
        query:
          "query getAllUserNa($take: Int!, $skip: Int!, $id: Int!) { getAllUserNa(take: $take, skip: $skip, id: $id) {total, skip, take, data {id, q4, status, form_status, office_status, dept_user {role}, village {name}}}}",
        variables: {
          take: pagination.take,
          skip: pagination.skip,
          id: parseInt(userid!.toString()),
        },
      });

      if (!response.status) {
        throw new Error(response.message);
      }

      // if value is not in response.data then return the error
      if (!(response.data as Record<string, unknown>)["getAllUserNa"]) {
        throw new Error("Value not found in response");
      }
      return (response.data as Record<string, unknown>)[
        "getAllUserNa"
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

  const deleteNa = useMutation({
    mutationFn: async (id: number) => {
      const response = await ApiCall({
        query:
          "mutation DeleteNa($id: Int!) { deleteNa(id: $id) { id } }",
        variables: {
          id: id,
        },
      });

      if (!response.status) {
        throw new Error(response.message);
      }

      if (!(response.data as Record<string, unknown>)["deleteNa"]) {
        throw new Error("Failed to delete NA form");
      }

      return (response.data as Record<string, unknown>)["deleteNa"];
    },

    onSuccess: () => {
      toast.success("Draft deleted successfully");
      naformdata.refetch();
    },

    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const handleDelete = (id: number, name: string) => {
    setDeleteData({ id, name });
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (deleteData) {
      deleteNa.mutate(deleteData.id);
      setDeleteModalOpen(false);
    }
  };

  const handleCancelDelete = () => {
    setDeleteModalOpen(false);
    setDeleteData(null);
  };

  const permissionTypes = [
    { label: "Subdivision", key: "Subdivision" },
    { label: "Amalgamation Permission", key: "Amalgamation Permission" },
    { label: "Family Partition Permission", key: "Family Partition Permission" },
    { label: "Change of NA Permission", key: "Change of NA Permission" },
    { label: "Sale NA Permission", key: "Sale NA Permission" },
    { label: "Gift NA Permission", key: "Gift NA Permission" },
  ];

  const handlePermissionSelect = (key: string) => {
    router.push(`/dashboard/user/na-permission/add?title=${encodeURIComponent(key)}`);
  };

  return (
    <div className="p-6">
      <div className="flex gap-2 items-center">
        <h1 className="text-[#162f57] text-2xl font-semibold">NA Permission</h1>
        <div className="grow"></div>
        <Dropdown
          menu={{
            items: permissionTypes.map((item) => ({
              ...item,
              icon: <MaterialSymbolsLightAdd className="text-lg" />,
            })),
            onClick: (e) => handlePermissionSelect(e.key),
            style: { minWidth: "250px" },
          }}
          placement="bottomRight"
          overlayStyle={{
            boxShadow: "0 4px 12px rgba(22, 47, 87, 0.15)",
            borderRadius: "8px",
          }}
        >
          <button className="bg-[#162f57] text-white px-4 py-2 rounded-lg flex items-center gap-2 cursor-pointer hover:bg-[#1a3a6b] transition shadow-md hover:shadow-lg font-medium">
            <MaterialSymbolsLightAdd className="text-white text-lg" />
            New Permission
          </button>
        </Dropdown>
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
                      Status
                    </th>
                    <th className="border border-gray-300 px-4 py-2 text-left text-md font-normal">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {naformdata.data?.data.map((naform, index) => (
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
                        {naform.form_status}
                      </td>
                      <td className="border border-gray-300 px-4 py-2 font-normal text-sm">
                        <div className="flex gap-2">
                          <button
                            className="bg-blue-500 text-white px-4 py-1 rounded-md cursor-pointer hover:bg-blue-600"
                            onClick={() => {
                              if (naform.form_status == "DRAFT") {
                                router.push(
                                  `/dashboard/user/na-permission/view/${encryptURLData(
                                    naform.id.toString(),
                                  )}/preview`,
                                );
                              } else {
                                router.push(
                                  `/dashboard/user/na-permission/view/${encryptURLData(
                                    naform.id.toString(),
                                  )}`,
                                );
                              }
                            }}
                          >
                            View
                          </button>
                          {naform.form_status === "DRAFT" && (
                            <button
                              className="bg-red-500 text-white px-4 py-1 rounded-md cursor-pointer hover:bg-red-600"
                              onClick={() => handleDelete(naform.id, naform.q4)}
                              disabled={deleteNa.isPending}
                            >
                              {deleteNa.isPending ? "Deleting..." : "Delete"}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
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

      <Modal
        title="Delete Draft"
        open={deleteModalOpen}
        onCancel={handleCancelDelete}
        okText="Delete"
        okType="danger"
        cancelText="Cancel"
        onOk={handleConfirmDelete}
        confirmLoading={deleteNa.isPending}
      >
        <p>
          Are you sure you want to delete the draft for "{deleteData?.name}"?
          This action cannot be undone.
        </p>
      </Modal>
    </div>
  );
};

export default NaPermission;
