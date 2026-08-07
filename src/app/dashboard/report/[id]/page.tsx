"use client";
import { ApiCall } from "@/services/api";
import { baseurl } from "@/utils/const";
import { decryptURLData, formatDateTime } from "@/utils/methods";
import { useQuery } from "@tanstack/react-query";
import { Button, Drawer } from "antd";
import { getCookie } from "cookies-next/client";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

interface ObpsResponse {
  id: number;
  last_name: string;
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
  createdById: number;
  villageId: number;
  status: string;
  village: {
    id: number;
    name: string;
  };
  createdBy: {
    firstName: string;
    lastName: string;
    role: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const ObpsReport = () => {
  const router = useRouter();
  const { id } = useParams<{ id: string | string[] }>();
  const idString = Array.isArray(id) ? id[0] : id;

  let formid: number = 0;
  try {
    formid = parseInt(decryptURLData(idString, router));
  } catch (error) {
    return (
      <div className="py-4 px-4">
        <div className="bg-red-50 border border-red-200 p-4 rounded-md">
          <h1 className="text-red-600 font-semibold">Invalid ID</h1>
          <p className="text-red-500 text-sm">
            The provided ID could not be decrypted.
          </p>
        </div>
      </div>
    );
  }

  const formdata = useQuery({
    queryKey: ["getObpsById", formid],
    queryFn: async () => {
      const response = await ApiCall({
        query:
          "query GetObps($id:Int!) { getObps(id: $id) { id, last_name, q4, q5, q6, q7, q8, q9, q10, q11, q12, anx1, anx2, anx3, anx4, anx5, createdById, villageId, status, village { id, name }, createdBy { firstName, lastName, role }, createdAt, updatedAt }}",
        variables: {
          id: formid,
        },
      });

      if (!response.status) {
        throw new Error(response.message);
      }

      if (!(response.data as Record<string, unknown>)["getObps"]) {
        throw new Error("OBPS Record not found");
      }
      return (response.data as Record<string, unknown>)[
        "getObps"
      ] as ObpsResponse;
    },
  });

  if (formdata.isLoading) {
    return (
      <div className="py-4 px-4">
        <div className="bg-white p-4 rounded-md shadow-md">
          <p className="text-gray-600">Loading OBPS report...</p>
        </div>
      </div>
    );
  }

  if (formdata.isError) {
    return (
      <div className="py-4 px-4">
        <div className="bg-red-50 border border-red-200 p-4 rounded-md">
          <h1 className="text-red-600 font-semibold">Error Loading Report</h1>
          <p className="text-red-500 text-sm">{formdata.error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-4 px-4">
      <div className="flex gap-3 items-center mb-4">
        <h1 className="text-[#162f57] text-2xl font-bold">OBPS Report</h1>
        <div className="grow"></div>
        <button
          onClick={() => router.back()}
          className="bg-red-500 text-white py-2 px-4 rounded-lg text-sm hover:bg-red-600 transition"
        >
          Back
        </button>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* Header Card */}
        <div className="bg-white rounded-lg shadow-sm border-l-4 border-blue-500 p-4 mb-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold text-gray-800">
                OBPS Application
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                Ref ID: #{formdata.data!.id}
              </p>
            </div>
          </div>
        </div>

        {/* Applicant Details */}
        <div className="bg-white rounded-lg shadow-sm mb-4 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-3">
            <h3 className="text-white font-bold text-sm">Applicant Details</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
            <div className="space-y-1">
              <p className="text-xs text-gray-500 font-semibold">Full Name</p>
              <p className="text-sm text-gray-800 font-medium">
                {formdata.data!.q4}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-gray-500 font-semibold">Last Name</p>
              <p className="text-sm text-gray-800 font-medium">
                {formdata.data!.last_name}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-gray-500 font-semibold">Address</p>
              <p className="text-sm text-gray-800 font-medium">
                {formdata.data!.q5}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-gray-500 font-semibold">Occupation</p>
              <p className="text-sm text-gray-800 font-medium">
                {formdata.data!.q6}
              </p>
            </div>
          </div>
        </div>

        {/* Land Details */}
        <div className="bg-white rounded-lg shadow-sm mb-4 overflow-hidden">
          <div className="bg-gradient-to-r from-amber-500 to-amber-600 px-4 py-3">
            <h3 className="text-white font-bold text-sm">Land Details</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4">
            <div className="space-y-1">
              <p className="text-xs text-gray-500 font-semibold">Village</p>
              <p className="text-sm text-gray-800 font-medium">
                {formdata.data!.village.name}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-gray-500 font-semibold">
                Survey Number
              </p>
              <p className="text-sm text-gray-800 font-medium">
                {formdata.data!.q8 || "N/A"}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-gray-500 font-semibold">
                Old Survey Number
              </p>
              <p className="text-sm text-gray-800 font-medium">
                {formdata.data!.q9}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-gray-500 font-semibold">Total Area</p>
              <p className="text-sm text-gray-800 font-medium">
                {formdata.data!.q10}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-gray-500 font-semibold">
                Area Assessed
              </p>
              <p className="text-sm text-gray-800 font-medium">
                {formdata.data!.q11}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-gray-500 font-semibold">Purpose</p>
              <p className="text-sm text-gray-800 font-medium">
                {formdata.data!.q12}
              </p>
            </div>
          </div>
        </div>

        {/* Attachments */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-500 to-indigo-600 px-4 py-3">
            <h3 className="text-white font-bold text-sm">Attachments</h3>
          </div>
          <div className="p-4">
            {[
              { file: formdata.data!.anx1, name: "7/12 Extracts" },
              { file: formdata.data!.anx2, name: "NA-Order" },
              { file: formdata.data!.anx3, name: "NA-Sanad" },
              { file: formdata.data!.anx4, name: "Certified Plans/Maps" },
              { file: formdata.data!.anx5, name: "Others" },
            ]
              .filter((item) => item.file)
              .map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-2 hover:bg-gray-50 rounded"
                >
                  <span className="text-sm text-gray-700 font-medium">
                    {item.name}
                  </span>
                  <Link
                    target="_blank"
                    href={`${baseurl}/${item.file}`}
                    className="bg-blue-500 text-white py-1 px-3 rounded text-xs hover:bg-blue-600 transition"
                  >
                    View
                  </Link>
                </div>
              ))}
            {[
              formdata.data!.anx1,
              formdata.data!.anx2,
              formdata.data!.anx3,
              formdata.data!.anx4,
              formdata.data!.anx5,
            ].filter(Boolean).length === 0 && (
              <p className="text-sm text-gray-500 text-center py-4">
                No attachments available
              </p>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6">
          <Button
            onClick={() => router.back()}
            className="bg-gray-500 text-white px-6"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ObpsReport;
