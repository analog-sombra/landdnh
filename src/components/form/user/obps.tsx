"use client";

import { FormProvider, useForm, useFormContext } from "react-hook-form";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { encryptURLData, onFormError } from "@/utils/methods";
import { TextInput } from "../inputfields/textinput";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ApiCall, UploadFile } from "@/services/api";
import { ObpsForm, ObpsSchema } from "@/schema/user/obpsform";
import { MultiSelect } from "../inputfields/multiselect";
import { toast } from "react-toastify";
import { YesNoRadioInput } from "../inputfields/yesnoradioinput";
import { useRef, useState } from "react";
import Link from "next/link";
import { getCookie } from "cookies-next/client";
import { Checkbox } from "antd";

interface VillageResponse {
  id: number;
  name: string;
}

export const ObpsProvider = () => {
  const methods = useForm<ObpsForm>({
    resolver: valibotResolver(ObpsSchema),
  });

  return (
    <FormProvider {...methods}>
      <ObpsPage />
    </FormProvider>
  );
};

interface ObpsTextInterface {
  q4: boolean;
  q5: boolean;
  q6: boolean;
  q7: boolean;
  q8: boolean;
  q9: boolean;
  q10: boolean;
  q11: boolean;
  q12: boolean;
}

const ObpsPage = () => {
  const router = useRouter();

  const userid = getCookie("id");

  const anx1Ref = useRef<HTMLInputElement>(null);
  const anx2Ref = useRef<HTMLInputElement>(null);
  const anx3Ref = useRef<HTMLInputElement>(null);
  const anx4Ref = useRef<HTMLInputElement>(null);
  const anx5Ref = useRef<HTMLInputElement>(null);

  const [anx1, setAnx1] = useState<File | null>(null);
  const [anx2, setAnx2] = useState<File | null>(null);
  const [anx3, setAnx3] = useState<File | null>(null);
  const [anx4, setAnx4] = useState<File | null>(null);
  const [anx5, setAnx5] = useState<File | null>(null);

  const [obpsTextData, setObpsTextData] = useState<ObpsTextInterface>({
    q4: false,
    q5: false,
    q6: false,
    q7: false,
    q8: false,
    q9: false,
    q10: false,
    q11: false,
    q12: false,
  });

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting, errors },
    setValue,
  } = useFormContext<ObpsForm>();

  const handleFileUpload = (ref: React.RefObject<HTMLInputElement | null>) => {
    if (ref!.current) {
      ref!.current.click();
    }
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
    setFile: React.Dispatch<React.SetStateAction<File | null>>,
    ref: React.RefObject<HTMLInputElement | null>,
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setFile(file);
      const resposne = await UploadFile(file, userid!);
      if (!resposne.status) {
        toast.error(resposne.message);
        return;
      }

      setValue(ref.current!.name as keyof ObpsForm, resposne.data as string);
    }
  };

  const allvillage = useQuery({
    queryKey: ["allvillage"],
    queryFn: async () => {
      const response = await ApiCall({
        query: "query GetAllVillage { getAllVillage { id, name } }",
        variables: {},
      });

      if (!response.status) {
        throw new Error(response.message);
      }

      if (!(response.data as Record<string, unknown>)["getAllVillage"]) {
        throw new Error("Value not found in response");
      }
      return (response.data as Record<string, unknown>)["getAllVillage"] as [
        VillageResponse,
      ];
    },
  });

  type ObpsResponse = {
    id: string;
  };

  const obpsform = useMutation({
    mutationKey: ["createObps"],
    mutationFn: async (data: ObpsForm) => {
      const response = await ApiCall({
        query:
          "mutation CreateObps($createObpsInput: CreateObpsInput!) {createObps(createObpsInput: $createObpsInput) { id }}",
        variables: {
          createObpsInput: {
            ...data,
            createdById: Number(userid),
          },
        },
      });

      if (!response.status) {
        throw new Error(response.message);
      }

      if (!(response.data as Record<string, unknown>)["createObps"]) {
        throw new Error("Value not found in response");
      }
      return (response.data as Record<string, unknown>)[
        "createObps"
      ] as ObpsResponse;
    },

    onSuccess: (data) => {
      toast.success("OBPS Form Created Successfully");
      router.push(`/report/${encryptURLData(data!.id.toString())}`);
    },

    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const onSubmit = async (data: ObpsForm) => {
    obpsform.mutate({
      ...data,
    });
  };

  if (allvillage.isLoading) {
    return <div>Loading...</div>;
  }
  if (allvillage.isError) {
    return <div>{allvillage.error.message}</div>;
  }

  return (
    <div className="px-4 py-2">
      <form onSubmit={handleSubmit(onSubmit, onFormError)}>
        <div className="p-2 bg-white rounded-md shadow-md">
          <h1 className="mx-4 text-lg text-center font-semibold mt-4">
            OBPS FORM
          </h1>
          <p className="mx-4 text-xs text-left mt-4">To,</p>
          <p className="mx-4 text-xs text-left">The Collector,</p>
          <p className="mx-4 text-xs text-left">Dadra and Nager Haveli,</p>
          <p className="mx-4 text-xs text-left">Silvassa, DNH & DD</p>
          <h1 className="mx-4 text-sm text-center font-semibold underline">
            SUBJECT : Application for OBPS
          </h1>
          <p className="mx-4 text-xs text-left">Sir,</p>

          <p className="mx-4 text-xs text-left">
            We, the undersigned hereby apply for grant of permission for{" "}
            <span className="font-semibold">OBPS</span> for which details are
            given below :-
          </p>

          <div className="bg-gray-100 px-4 py-1 my-2 mx-4 text-sm">
            Applicant Details
          </div>

          <div className="flex gap-4 p-4">
            <div className="flex-1">
              <label className="text-sm font-semibold text-gray-700">
                Village
              </label>
              <MultiSelect<ObpsForm>
                name="villageId"
                required={true}
                placeholder="Select Village"
                options={
                  allvillage.data?.map((village) => ({
                    label: village.name,
                    value: village.id,
                  })) || []
                }
              />
            </div>
          </div>

          <div className="bg-gray-100 px-4 py-1 my-2 mx-4 text-sm">
            Annexure Details
          </div>

          <div className="flex p-2 px-16 items-center mt-2 gap-2 border-b border-gray-200">
            <div>
              <p className="text-sm text-gray-700">
                Annexure 1: A certified copy of record of rights
                <span className="text-red-500">
                  (to be attached in form of pdf)
                </span>
              </p>
            </div>
            <div className="grow"></div>
            {anx1 ? (
              <button
                type="button"
                onClick={() => setAnx1(null)}
                className="py-1 rounded-md bg-red-500 px-4 text-sm text-white cursor-pointer w-28"
              >
                Remove
              </button>
            ) : (
              <button
                type="button"
                onClick={() => handleFileUpload(anx1Ref)}
                className="py-1 rounded-md bg-blue-500 px-4 text-sm text-white cursor-pointer w-28 text-nowrap"
              >
                Upload File
              </button>
            )}

            <input
              type="file"
              ref={anx1Ref}
              name="anx1"
              onChange={(e) => handleFileChange(e, setAnx1, anx1Ref)}
              className="hidden"
            />

            {anx1 && (
              <div className="flex gap-2 items-center">
                <Link
                  target="_blank"
                  href={URL.createObjectURL(anx1!)}
                  className="bg-gray-200 text-black py-1 px-4 rounded-md text-sm h-7 grid place-items-center w-28 text-nowrap"
                >
                  View File
                </Link>
              </div>
            )}
          </div>

          <div className="flex p-2 px-16 items-center mt-2 gap-2 border-b border-gray-200">
            <div>
              <p className="text-sm text-gray-700">
                Annexure 2: A sketch or layout of the site in question
              </p>
            </div>
            <div className="grow"></div>
            {anx2 ? (
              <button
                type="button"
                onClick={() => setAnx2(null)}
                className="py-1 rounded-md bg-red-500 px-4 text-sm text-white cursor-pointer w-28 flex-shrink-0"
              >
                Remove
              </button>
            ) : (
              <button
                type="button"
                onClick={() => handleFileUpload(anx2Ref)}
                className="py-1 rounded-md bg-blue-500 px-4 text-sm text-white cursor-pointer w-28 flex-shrink-0"
              >
                Upload File
              </button>
            )}

            <input
              type="file"
              ref={anx2Ref}
              name="anx2"
              onChange={(e) => handleFileChange(e, setAnx2, anx2Ref)}
              className="hidden"
            />

            {anx2 && (
              <div className="flex gap-2 items-center">
                <Link
                  target="_blank"
                  href={URL.createObjectURL(anx2!)}
                  className="bg-gray-200 text-black py-1 px-4 rounded-md text-sm h-7 grid place-items-center w-28 flex-shrink-0"
                >
                  View File
                </Link>
              </div>
            )}
          </div>

          <div className="flex p-2 px-16 items-center mt-2 gap-2 border-b border-gray-200">
            <p className="text-sm text-gray-700">
              Annexure 3: Written consent of the tenant/ occupant.
            </p>
            <div className="grow"></div>
            {anx3 ? (
              <button
                type="button"
                onClick={() => setAnx3(null)}
                className="py-1 rounded-md bg-red-500 px-4 text-sm text-white cursor-pointer w-28 flex-shrink-0"
              >
                Remove
              </button>
            ) : (
              <button
                type="button"
                onClick={() => handleFileUpload(anx3Ref)}
                className="py-1 rounded-md bg-blue-500 px-4 text-sm text-white cursor-pointer w-28 flex-shrink-0"
              >
                Upload File
              </button>
            )}

            <input
              type="file"
              ref={anx3Ref}
              name="anx3"
              onChange={(e) => handleFileChange(e, setAnx3, anx3Ref)}
              className="hidden"
            />

            {anx3 && (
              <div className="flex gap-2 items-center">
                <Link
                  target="_blank"
                  href={URL.createObjectURL(anx3!)}
                  className="bg-gray-200 text-black py-1 px-4 rounded-md text-sm h-7 grid place-items-center w-28 flex-shrink-0"
                >
                  View File
                </Link>
              </div>
            )}
          </div>

          <div className="flex p-2 px-16 items-center mt-2 gap-2 border-b border-gray-200">
            <div>
              <p className="text-sm text-gray-700">
                Annexure 4: Other Document
                <span className="text-red-500">
                  (to be attached in form of pdf)
                </span>
              </p>
            </div>
            <div className="grow"></div>
            {anx4 ? (
              <button
                type="button"
                onClick={() => setAnx4(null)}
                className="py-1 rounded-md bg-red-500 px-4 text-sm text-white cursor-pointer w-28 flex-shrink-0"
              >
                Remove
              </button>
            ) : (
              <button
                type="button"
                onClick={() => handleFileUpload(anx4Ref)}
                className="py-1 rounded-md bg-blue-500 px-4 text-sm text-white cursor-pointer w-28 flex-shrink-0"
              >
                Upload File
              </button>
            )}

            <input
              type="file"
              ref={anx4Ref}
              onChange={(e) => handleFileChange(e, setAnx4, anx4Ref)}
              name="anx4"
              className="hidden"
            />

            {anx4 && (
              <div className="flex gap-2 items-center">
                <Link
                  target="_blank"
                  href={URL.createObjectURL(anx4!)}
                  className="bg-gray-200 text-black py-1 px-4 rounded-md text-sm h-7 grid place-items-center w-28 flex-shrink-0"
                >
                  View File
                </Link>
              </div>
            )}
          </div>

          <div className="flex p-2 px-16 items-center mt-2 gap-2 border-b border-gray-200">
            <p className="text-sm text-gray-700">Annexure 5: Other Document</p>
            <div className="grow"></div>
            {anx5 ? (
              <button
                type="button"
                onClick={() => setAnx5(null)}
                className="py-1 rounded-md bg-red-500 px-4 text-sm text-white cursor-pointer w-28 flex-shrink-0"
              >
                Remove
              </button>
            ) : (
              <button
                type="button"
                onClick={() => handleFileUpload(anx5Ref)}
                className="py-1 rounded-md bg-blue-500 px-4 text-sm text-white cursor-pointer w-28 flex-shrink-0"
              >
                Upload File
              </button>
            )}

            <input
              type="file"
              ref={anx5Ref}
              name="anx5"
              onChange={(e) => handleFileChange(e, setAnx5, anx5Ref)}
              className="hidden"
            />

            {anx5 && (
              <div className="flex gap-2 items-center">
                <Link
                  target="_blank"
                  href={URL.createObjectURL(anx5!)}
                  className="bg-gray-200 text-black py-1 px-4 rounded-md text-sm h-7 grid place-items-center w-28 flex-shrink-0"
                >
                  View File
                </Link>
              </div>
            )}
          </div>

          <div className="bg-gray-100 px-4 py-1 my-2 mx-4 text-sm">
            Additional Information
          </div>

          <div className="grid grid-cols-2 gap-4 p-4">
            <div>
              <label className="text-sm font-semibold text-gray-700">
                Full Name
              </label>
              <TextInput<ObpsForm>
                required={true}
                name="q4"
                placeholder="Enter Full Name"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700">
                Last Name
              </label>
              <TextInput<ObpsForm>
                required={true}
                name="last_name"
                placeholder="Enter Last Name"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700">
                Address
              </label>
              <TextInput<ObpsForm>
                required={true}
                name="q5"
                placeholder="Enter Address"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700">
                Occupation
              </label>
              <TextInput<ObpsForm>
                required={true}
                name="q6"
                placeholder="Enter Occupation"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700">
                Village of Land
              </label>
              <TextInput<ObpsForm>
                required={true}
                name="q7"
                placeholder="Enter Village"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700">
                Survey Number
              </label>
              <TextInput<ObpsForm>
                required={false}
                name="q8"
                placeholder="Enter Survey Number"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700">
                Old Survey Number
              </label>
              <TextInput<ObpsForm>
                required={true}
                name="q9"
                placeholder="Enter Old Survey Number"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700">
                Total Area
              </label>
              <TextInput<ObpsForm>
                required={true}
                name="q10"
                placeholder="Enter Total Area"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700">
                Area Assessed
              </label>
              <TextInput<ObpsForm>
                required={true}
                name="q11"
                placeholder="Enter Assessed Area"
              />
            </div>
            <div>
              <label className="text-sm font-semibold text-gray-700">
                Purpose
              </label>
              <TextInput<ObpsForm>
                required={true}
                name="q12"
                placeholder="Enter Purpose"
              />
            </div>
          </div>

          <div className="flex gap-4 p-4 justify-end">
            <button
              type="button"
              onClick={() => router.back()}
              className="py-2 px-6 rounded-md bg-gray-500 text-white font-semibold hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || obpsform.isPending}
              className="py-2 px-6 rounded-md bg-blue-600 text-white font-semibold hover:bg-blue-700 disabled:opacity-50"
            >
              {isSubmitting || obpsform.isPending ? "Submitting..." : "Submit"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
