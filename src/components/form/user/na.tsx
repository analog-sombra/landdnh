"use client";

import {
  FormProvider,
  useFieldArray,
  useForm,
  useFormContext,
} from "react-hook-form";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { encryptURLData, onFormError } from "@/utils/methods";
import { TextInput } from "../inputfields/textinput";
import { useRouter } from "next/navigation";
import { useMutation, useQuery } from "@tanstack/react-query";
import { ApiCall, UploadFile } from "@/services/api";
import { NAForm, NASchema } from "@/schema/user/naform";
import { MultiSelect } from "../inputfields/multiselect";
import { toast } from "react-toastify";
import { YesNoRadioInput } from "../inputfields/yesnoradioinput";
import { useRef, useState } from "react";
import Link from "next/link";
import { getCookie } from "cookies-next/client";

interface VillageResponse {
  id: number;
  name: string;
}

export const NaProvider = () => {
  const methods = useForm<NAForm>({
    resolver: valibotResolver(NASchema),
  });

  return (
    <FormProvider {...methods}>
      <NaPage />
    </FormProvider>
  );
};

const NaPage = () => {
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

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting, errors },
    control,
    setValue,
    getValues,
  } = useFormContext<NAForm>();

  const handleFileUpload = (ref: React.RefObject<HTMLInputElement | null>) => {
    if (ref!.current) {
      ref!.current.click();
    }
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
    setFile: React.Dispatch<React.SetStateAction<File | null>>,
    ref: React.RefObject<HTMLInputElement | null>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      setFile(file);
      const resposne = await UploadFile(file, userid!);
      if (!resposne.status) {
        toast.error(resposne.message);
        return;
      }

      setValue(ref.current!.name as keyof NAForm, resposne.data as string);
    }
  };

  const serveys = useFieldArray({
    control,
    name: "surveys",
  });
  const applicants = useFieldArray({
    control,
    name: "applicants",
  });

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

      // if value is not in response.data then return the error
      if (!(response.data as Record<string, unknown>)["getAllVillage"]) {
        throw new Error("Value not found in response");
      }
      return (response.data as Record<string, unknown>)["getAllVillage"] as [
        VillageResponse
      ];
    },
  });

  type NaResponse = {
    id: string;
  };

  const naform = useMutation({
    mutationKey: ["login"],
    mutationFn: async (data: NAForm) => {
      if (data.surveys.length === 0) {
        toast.error("Please add atleast one survey");
        return;
      }

      const response = await ApiCall({
        query:
          "mutation CreateNa($createNaInput: CreateNaInput!) {createNa(createNaInput: $createNaInput) { id }}",
        variables: {
          createNaInput: {
            ...data,
          },
        },
      });

      if (!response.status) {
        throw new Error(response.message);
      }

      // if value is not in response.data then return the error
      if (!(response.data as Record<string, unknown>)["createNa"]) {
        throw new Error("Value not found in response");
      }
      return (response.data as Record<string, unknown>)[
        "createNa"
      ] as NaResponse;
    },

    onSuccess: (data) => {
      router.push(
        `/dashboard/user/na-permission/view/${encryptURLData(
          data!.id.toString()
        )}`
      );
    },

    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const onSubmit = async (data: NAForm) => {
    naform.mutate({
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
          {/* <h1 className="mx-4 text-xs text-center font-semibold mt-4">SCHEDULE-1</h1>
          <h1 className="mx-4 text-xs text-center font-normal">(See Rule 3)</h1>
          <h1 className="mx-4 text-xs text-center font-semibold">FORM ON APPLICATION UNDER SECTION B - 8 OF DAPVR, 1962</h1>
          <h1 className="mx-4 text-xs text-center font-semibold">As amended by DAPVR (Amendment) Act - 1968</h1>
          <h1 className="mx-4 text-xs text-center font-semibold">Sub Section(1) of Section 32 of the Goa, Daman & Biu Land Revenue Code, 1969</h1>
          <h1 className="mx-4 text-sm text-center font-semibold"> OF PERMISSION TO GIFT OF THE LAND</h1> */}
          <h1 className="mx-4 text-lg text-center font-semibold mt-4">
            F O R M - V I I
          </h1>
          <h1 className="text-lg text-center font-semibold leading-3">
            (See Rule 46)
          </h1>
          <p className="mx-4 text-xs text-left mt-2">
            Form of application under Sub-section (1) of Section 42 of the Dadra
            and Nagar Haveli. Land Revenue Administration Regulation, 1971.
          </p>
          <p className="mx-4 text-xs text-left mt-4">To,</p>
          <p className="mx-4 text-xs text-left">The Collector,</p>
          <p className="mx-4 text-xs text-left">Dadra and Nager Haveli,</p>
          <p className="mx-4 text-xs text-left">Silvassa, DNH & DD</p>
          <h1 className="mx-4 text-sm text-center font-semibold underline">
            SUBJECT : Application for grant of permission for NA OF LAND
          </h1>
          <p className="mx-4 text-xs text-left">Sir,</p>

          <p className="mx-4 text-xs text-left">
            We, the undersigned hereby apply for grant of permission for{" "}
            <span className="font-semibold">NA OF LAND</span> for which details
            are given below :-
          </p>
          {/* <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"> */}
          <div className="bg-gray-100 px-4 py-1 my-2 mx-4 text-sm">
            Applicant Details
          </div>
          <div>
            <div className="flex gap-8 border-b border-gray-200 pb-2 mb-2 px-16">
              <p className="flex-1 text-sm text-gray-500">
                (a) Assessed or held for the purpose of agriculture/for the
                non-agriculture purpose /purpose of.
              </p>
              <div className="flex-1">
                <YesNoRadioInput<NAForm>
                  name="q1"
                  required={true}
                  valueOne="Yes"
                  valueTwo="No"
                />
              </div>
            </div>

            <div className="flex gap-8 border-b border-gray-200 pb-2 mb-2 px-16">
              <p className="flex-1 text-sm text-gray-500">
                (b) Assessed or held for the non-agriculture purpose of
              </p>
              <div className="flex-1">
                <TextInput<NAForm>
                  required={true}
                  name="q2"
                  placeholder="Enter Details"
                />
              </div>
            </div>

            <div className="flex gap-8 border-b border-gray-200 pb-2 mb-2 px-16">
              <p className="flex-1 text-sm text-gray-500">
                (c) Assessed or held for the non-agriculture purpose but in
                relaxation of condition on the time of grant of land or
                permission for such non-agricultural use Viz
              </p>
              <div className="flex-1">
                <TextInput<NAForm>
                  required={true}
                  name="q3"
                  placeholder="Enter Details"
                />
              </div>
            </div>
            <div className="bg-gray-100 px-4 py-1 my-2 mx-4 text-sm">
              Annexure Details
            </div>
            <div className="flex p-2 px-16 items-center mt-2 gap-2 border-b border-gray-200">
              <p className="text-sm text-gray-700">
                Annexure 1: A certified copy of record of rights in respect of
                rights in respect of the land as existed at right the time of
                application.
              </p>
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
                  {/* <p className="text-sm text-gray-700">{anx1.name}</p> */}
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
              <p className="text-sm text-gray-700">
                Annexure 2: A sketch or layout of the site in question (in
                triplicate) showing the location of the proposed building or
                other works for which permission is sought and the nearest roads
                or means or access.
              </p>
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
                  {/* <p className="text-sm text-gray-700">{anx2.name}</p> */}
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
                Annexure 3: Writter/ consent ofthe tenant/ occupant.
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
                  {/* <p className="text-sm text-gray-700">{anx3.name}</p> */}
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
              <p className="text-sm text-gray-700">Annexure 4: V.F. No.8-A</p>
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
                  {/* <p className="text-sm text-gray-700">{anx4.name}</p> */}
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
              <p className="text-sm text-gray-700">Annexure 5: 7x12 Extract.</p>
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
                  {/* <p className="text-sm text-gray-700">{anx5.name}</p> */}
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
              Also furnish the following information
            </div>

            <div className="flex gap-8 border-b border-gray-200 pb-2 mb-2 px-16">
              <p className="flex-1 text-sm text-gray-500">
                1. Full Name of the Applicant.
              </p>
              <div className="flex-1">
                <TextInput<NAForm>
                  required={true}
                  name="q4"
                  placeholder="Enter Details"
                />
              </div>
            </div>

            <div className="flex gap-8 border-b border-gray-200 pb-2 mb-2 px-16">
              <p className="flex-1 text-sm text-gray-500">
                2. Full Postal Address.
              </p>
              <div className="flex-1">
                <TextInput<NAForm>
                  required={true}
                  name="q5"
                  placeholder="Enter Details"
                />
              </div>
            </div>
            <div className="flex gap-8 border-b border-gray-200 pb-2 mb-2 px-16">
              <p className="flex-1 text-sm text-gray-500">
                3. Contact no of the applicant.
              </p>
              <div className="flex-1">
                <TextInput<NAForm>
                  required={true}
                  name="q6"
                  onlynumber={true}
                  maxlength={10}
                  placeholder="Enter Details"
                />
              </div>
            </div>

            <div className="bg-white  border-b border-gray-200 pb-2 mb-2 px-16">
              <div className="flex mb-2">
                <h1>Additional Applicant Details</h1>
                <div className="grow"></div>
                <button
                  type="button"
                  onClick={() =>
                    applicants.append({
                      firstName: "",
                      lastName: "",
                      contact: "",
                      relation: "",
                      signature_url: "",
                    })
                  }
                  className="py-1 rounded-md bg-green-500 px-4 text-sm text-white cursor-pointer"
                >
                  Add Applicant Detail
                </button>
              </div>
              {applicants.fields.length !== 0 && (
                <>
                  <div className="overflow-x-auto">
                    <table className="table-auto w-full border-collapse border border-gray-300">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="border border-gray-300 px-4 py-2 font-normal text-sm whitespace-nowrap">
                            First Name
                          </th>
                          <th className="border border-gray-300 px-4 py-2 font-normal text-sm whitespace-nowrap">
                            Last Name
                          </th>
                          <th className="border border-gray-300 px-4 py-2 font-normal text-sm">
                            Contact
                          </th>
                          <th className="border border-gray-300 px-4 py-2 font-normal text-sm">
                            Relation
                          </th>
                          <th className="border border-gray-300 px-4 py-2 font-normal text-sm w-52">
                            Signature
                          </th>
                          <th className="border border-gray-300 px-4 py-2 font-normal text-sm">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {applicants.fields.map((field, index) => (
                          <tr key={field.id}>
                            <td className="border border-gray-300 p-1">
                              <TextInput<NAForm>
                                name={`applicants.${index}.firstName`}
                                placeholder="Enter First Name"
                              />
                              {errors.applicants?.[index]?.firstName && (
                                <p className="text-red-500 text-sm">
                                  {errors.applicants[index].firstName.message}
                                </p>
                              )}
                            </td>
                            <td className="border border-gray-300 p-1">
                              <TextInput<NAForm>
                                name={`applicants.${index}.lastName`}
                                placeholder="Enter Last Name"
                              />
                              {errors.applicants?.[index]?.lastName && (
                                <p className="text-red-500 text-sm">
                                  {errors.applicants[index].lastName.message}
                                </p>
                              )}
                            </td>
                            <td className="border border-gray-300 p-1">
                              <TextInput<NAForm>
                                name={`applicants.${index}.contact`}
                                placeholder="Enter Contact"
                                onlynumber={true}
                                maxlength={10}
                              />
                              {errors.applicants?.[index]?.contact && (
                                <p className="text-red-500 text-sm">
                                  {errors.applicants[index].contact.message}
                                </p>
                              )}
                            </td>
                            <td className="border border-gray-300 p-1">
                              <TextInput<NAForm>
                                name={`applicants.${index}.relation`}
                                placeholder="Enter Relation"
                              />
                              {errors.applicants?.[index]?.relation && (
                                <p className="text-red-500 text-sm">
                                  {errors.applicants[index].relation.message}
                                </p>
                              )}
                            </td>
                            <td className="border border-gray-300 p-1 flex gap-2 items-center">
                              <input
                                type="file"
                                accept="image/*"
                                id={`signature-${index}`}
                                name={`applicants.${index}.signature`}
                                onChange={async (e) => {
                                  e.preventDefault();
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    const response = await UploadFile(
                                      file,
                                      userid!
                                    );
                                    if (!response.status) {
                                      toast.error(response.message);
                                      return;
                                    }
                                    // Get the latest values for this applicant
                                    const currentApplicant = getValues(`applicants.${index}`);
                                    applicants.update(index, {
                                      ...currentApplicant,
                                      signature_url: response.data as string,
                                    });
                                  }
                                }}
                                className="hidden w-full text-sm text-gray-500 file:mr-4 file:py-1 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                              />
                              <label
                                htmlFor={`signature-${index}`}
                                className="cursor-pointer inline-block py-1 px-3 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition"
                              >
                                {applicants.fields[index].signature_url
                                  ? "Change Signature"
                                  : "Upload Signature"}
                              </label>

                              {errors.applicants?.[index]?.signature_url && (
                                <p className="text-red-500 text-sm">
                                  {
                                    errors.applicants[index].signature_url
                                      .message
                                  }
                                </p>
                              )}
                            </td>

                            <td className="border border-gray-300  p-1 text-center">
                              <button
                                type="button"
                                onClick={() => applicants.remove(index)}
                                className="py-1 rounded-md bg-red-500 px-4 text-sm text-white cursor-pointer"
                              >
                                Remove
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>
            <div className="flex gap-8 border-b border-gray-200 pb-2 mb-2 px-16 ">
              <p className="flex-1 text-sm text-gray-500">(4) Village</p>
              <div className="flex-1">
                <MultiSelect<NAForm>
                  placeholder="Select Village"
                  name="villageId"
                  required={true}
                  options={allvillage.data!.map((village) => ({
                    label: village.name,
                    value: village.id,
                  }))}
                />
              </div>
            </div>
            <div className="flex gap-8 border-b border-gray-200 pb-2 mb-2 px-16">
              <p className="flex-1 text-sm text-gray-500">(5) Survey No</p>
              <div className="flex-1">
                <TextInput<NAForm>
                  required={true}
                  name="q7"
                  placeholder="Enter Details"
                />
              </div>
            </div>
            <div className="flex gap-8 border-b border-gray-200 pb-2 mb-2 px-16">
              <p className="flex-1 text-sm text-gray-500">(6) Sub Division</p>
              <div className="flex-1">
                <TextInput<NAForm>
                  required={true}
                  name="q8"
                  placeholder="Enter Details"
                />
              </div>
            </div>

            <div className="flex gap-8 border-b border-gray-200 pb-2 mb-2 px-16">
              <p className="flex-1 text-sm text-gray-500">(7) Area in Sq.mt.</p>
              <div className="flex-1">
                <TextInput<NAForm>
                  required={true}
                  name="q9"
                  placeholder="Enter Details"
                />
              </div>
            </div>
            <div className="flex gap-8 border-b border-gray-200 pb-2 mb-2 px-16">
              <p className="flex-1 text-sm text-gray-500">(8) Old Survey No</p>
              <div className="flex-1">
                <TextInput<NAForm>
                  required={true}
                  name="q10"
                  placeholder="Enter Details"
                />
              </div>
            </div>

            <div className="bg-white  border-b border-gray-200 pb-2 mb-2 px-16">
              <div className="flex mb-2">
                <h1>Survey Details</h1>
                <div className="grow"></div>
                <button
                  type="button"
                  onClick={() =>
                    serveys.append({
                      survey_no: "",
                      area: "",
                      sub_division: "",
                    })
                  }
                  className="py-1 rounded-md bg-green-500 px-4 text-sm text-white cursor-pointer"
                >
                  Add Survey Detail
                </button>
              </div>
              {serveys.fields.length !== 0 && (
                <div className="overflow-x-auto">
                  <table className="table-auto w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border border-gray-300 px-4 py-2 font-normal text-sm">
                          Survey No
                        </th>
                        <th className="border border-gray-300 px-4 py-2 font-normal text-sm">
                          Area in Sq.mt.
                        </th>
                        <th className="border border-gray-300 px-4 py-2 font-normal text-sm">
                          Sub Division
                        </th>
                        <th className="border border-gray-300 px-4 py-2 font-normal text-sm">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {serveys.fields.map((field, index) => (
                        <tr key={field.id}>
                          <td className="border border-gray-300 px-4 py-2">
                            <TextInput<NAForm>
                              title=""
                              required={true}
                              name={`surveys.${index}.survey_no`}
                              placeholder="Enter Survey No"
                            />
                            {errors.surveys?.[index]?.survey_no && (
                              <p className="text-red-500 text-sm">
                                {errors.surveys[index].survey_no.message}
                              </p>
                            )}
                          </td>
                          <td className="border border-gray-300 px-4 py-2">
                            <TextInput<NAForm>
                              title=""
                              required={true}
                              name={`surveys.${index}.area`}
                              placeholder="Enter Area in Sq.mt."
                            />
                            {errors.surveys?.[index]?.area && (
                              <p className="text-red-500 text-sm">
                                {errors.surveys[index].area.message}
                              </p>
                            )}
                          </td>
                          <td className="border border-gray-300 px-4 py-2">
                            <TextInput<NAForm>
                              title=""
                              required={true}
                              name={`surveys.${index}.sub_division`}
                              placeholder="Enter Sub Division"
                            />
                            {errors.surveys?.[index]?.sub_division && (
                              <p className="text-red-500 text-sm">
                                {errors.surveys[index].sub_division.message}
                              </p>
                            )}
                          </td>

                          <td className="border border-gray-300 px-4 py-2 text-center">
                            <button
                              type="button"
                              onClick={() => serveys.remove(index)}
                              className="py-1 rounded-md bg-red-500 px-4 text-sm text-white cursor-pointer"
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
            <div className="flex gap-8 border-b border-gray-200 pb-2 mb-2 px-16">
              <p className="flex-1 text-sm text-gray-500">
                (9) Area of the site out of (5) above to be used for.
              </p>
              <div className="flex-1">
                <TextInput<NAForm>
                  required={true}
                  name="q11"
                  placeholder="Enter Details"
                />
              </div>
            </div>
            <div className="flex gap-8 border-b border-gray-200 pb-2 mb-2 px-16">
              <p className="flex-1 text-sm text-gray-500">
                (10) Type (Residential/Commercial/Industrial)
              </p>
              <div className="flex-1">
                <TextInput<NAForm>
                  required={true}
                  name="q12"
                  placeholder="Enter Details"
                />
              </div>
            </div>
            <div className="flex gap-8 border-b border-gray-200 pb-2 mb-2 px-16">
              <p className="flex-1 text-sm text-gray-500">
                (11) Present use of the land and whether any building exists
                thereon and if so, it&apos;s use.
              </p>
              <div className="flex-1">
                <TextInput<NAForm>
                  required={true}
                  name="q13"
                  placeholder="Enter Details"
                />
              </div>
            </div>
            <div className="flex gap-8 border-b border-gray-200 pb-2 mb-2 px-16">
              <p className="flex-1 text-sm text-gray-500">
                (12) Whether electrical light transmission lines pass over tle
                land and if so, the distance thereof from the proposed building
                other works.
              </p>
              <div className="flex-1">
                <TextInput<NAForm>
                  required={true}
                  name="q14"
                  placeholder="Enter Details"
                />
              </div>
            </div>
            <div className="flex gap-8 border-b border-gray-200 pb-2 mb-2 px-16">
              <p className="flex-1 text-sm text-gray-500">
                (13) Is, the land under acquisition ..If so, state details.
              </p>
              <div className="flex-1">
                <TextInput<NAForm>
                  required={true}
                  name="q15"
                  placeholder="Enter Details"
                />
              </div>
            </div>
            <div className="flex gap-8 border-b border-gray-200 pb-2 mb-2 px-16">
              <p className="flex-1 text-sm text-gray-500">
                (14) Is there a road from where the land is easily accessible ?
                State the name of the road and whether it is Highway, Major
                district road or village road. What is the distance of the
                proposed building or other work from the ienter ofthe road.
              </p>
              <div className="flex-1">
                <TextInput<NAForm>
                  required={true}
                  name="q16"
                  placeholder="Enter Details"
                />
              </div>
            </div>
            <div className="flex gap-8 border-b border-gray-200 pb-2 mb-2 px-16">
              <p className="flex-1 text-sm text-gray-500">
                (15) If there is no road adjoining the land, how is it proposed
                to be provided for access to the site.
              </p>
              <div className="flex-1">
                <TextInput<NAForm>
                  required={true}
                  name="q17"
                  placeholder="Enter Details"
                />
              </div>
            </div>
            <div className="flex gap-8 border-b border-gray-200 pb-2 mb-2 px-16">
              <p className="flex-1 text-sm text-gray-500">
                (16) Was a similar application made in the past for
                non-agricultural use of this land and was it rejected If yes,
                give details.
              </p>
              <div className="flex-1">
                <TextInput<NAForm>
                  required={true}
                  name="q18"
                  placeholder="Enter Details"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <div className="grow"></div>
          <button
            type="reset"
            onClick={(e) => {
              e.preventDefault();
              router.back();
            }}
            className="py-1 rounded-md bg-rose-500 px-4 text-sm text-white mt-2 cursor-pointer"
          >
            Back
          </button>

          <input
            type="reset"
            onClick={(e) => {
              e.preventDefault();
              reset({
                anx1: "",
                anx2: "",
                anx3: "",
                anx4: "",
                anx5: "",
                q1: false,
                q2: "",
                q3: "",
                q4: "",
                q5: "",
                q6: "",
                q7: "",
                q8: "",
                q9: "",
                q10: "",
                q11: "",
                q12: "",
                q13: "",
                q14: "",
                q15: "",
                q16: "",
                q17: "",
                q18: "",
              });
            }}
            value={"Reset"}
            className="py-1 rounded-md bg-blue-500 px-4 text-sm text-white mt-2 cursor-pointer"
          />

          <button
            type="submit"
            disabled={isSubmitting}
            className="py-1 rounded-md bg-blue-500 px-4 text-sm text-white mt-2 cursor-pointer"
          >
            {isSubmitting ? "Loading...." : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default NaPage;
