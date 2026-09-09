"use client";

import { NaProviderEdit } from "@/components/form/user/naedit";
import { decryptURLData } from "@/utils/methods";
import { useParams, useRouter } from "next/navigation";

const EditNaPermission = () => {
  const router = useRouter();
  const { id } = useParams<{ id: string | string[] }>();
  const idString = Array.isArray(id) ? id[0] : id;
  const formid: number = parseInt(decryptURLData(idString, router));

  return (
    <>
      <div className="pt-4">
        <h1 className="text-[#162f57] text-2xl font-semibold mx-4">
          Edit NA Permission
        </h1>
        <NaProviderEdit id={formid} />
      </div>
    </>
  );
};

export default EditNaPermission;
