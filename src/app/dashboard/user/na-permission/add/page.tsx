"use client";
import { NaProvider } from "@/components/form/user/na";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

const AddNaPermissionContent = () => {
  const searchParams = useSearchParams();
  const title = searchParams.get("title") || "NA Permission";

  return (
    <>
      <div className="pt-4">
        <h1 className="text-[#162f57] text-2xl font-semibold mx-4">
          Apply For {title}
        </h1>
        <NaProvider />
      </div>
    </>
  );
};

const AddNaPermission = () => {
  return (
    <Suspense fallback={<div className="p-4">Loading...</div>}>
      <AddNaPermissionContent />
    </Suspense>
  );
};

export default AddNaPermission;
