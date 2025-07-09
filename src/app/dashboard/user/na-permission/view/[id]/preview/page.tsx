"use client";
import { ApiCall } from "@/services/api";
import { baseurl } from "@/utils/const";
import { decryptURLData, encryptURLData } from "@/utils/methods";
import { useMutation, useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";

interface NaFormResponse {
  id: number;
  last_name: string;
  q1: boolean;
  q2: string;
  q3: string;
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
  q13: string;
  q14: string;
  q15: string;
  q16: string;
  q17: string;
  q18: string;
  createdById: number;
  village: {
    id: number;
    name: string;
  };
  na_applicant: {
    firstName: string;
    lastName: string;
    contact: string;
    relation: string;
    signature_url: string;
  }[];
  na_survey: {
    area: string;
    sub_division: string;
    survey_no: string;
    village: {
      name: string;
    };
  }[];
}

const ViewPermission = () => {
  const router = useRouter();
  const { id } = useParams<{ id: string | string[] }>();
  const idString = Array.isArray(id) ? id[0] : id;
  const formid: number = parseInt(decryptURLData(idString, router));

  const formdata = useQuery({
    queryKey: ["getnaform", formid],
    queryFn: async () => {
      const response = await ApiCall({
        query:
          "query GetNaById($id:Int!) { getNaById(id: $id) { id, last_name, q1, q2, q3, q4, anx1, anx2, anx3, anx4, anx5, q4, q5, q6, q7, q8, q9, q10, q11, q12, q13, q14, q15, q16, q17, q18, createdById, village{ id, name }, na_applicant { firstName, lastName, contact,relation, signature_url }, na_survey { area, sub_division, survey_no, village { name }}}}",
        variables: {
          id: formid,
        },
      });

      if (!response.status) {
        throw new Error(response.message);
      }

      if (!(response.data as Record<string, unknown>)["getNaById"]) {
        throw new Error("Value not found in response");
      }
      return (response.data as Record<string, unknown>)[
        "getNaById"
      ] as NaFormResponse;
    },
  });

  type NaResponse = {
    id: string;
  };

  const submitnaform = useMutation({
    mutationKey: ["login"],
    mutationFn: async () => {
      const response = await ApiCall({
        query:
          "mutation SubmitNaById($id: Int!) {submitNaById(id: $id) { id }}",
        variables: {
          id: formid,
        },
      });

      if (!response.status) {
        throw new Error(response.message);
      }

      // if value is not in response.data then return the error
      if (!(response.data as Record<string, unknown>)["submitNaById"]) {
        throw new Error("Value not found in response");
      }
      return (response.data as Record<string, unknown>)[
        "submitNaById"
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

  if (formdata.isLoading) {
    return <div>Loading...</div>;
  }

  if (formdata.isError) {
    return <div>Error: {formdata.error.message}</div>;
  }

  return (
    <div className="py-4">
      <div className="flex gap-2 items-center px-4">
        <h1 className="text-[#162f57] text-2xl font-semibold mx-4">
          View NA Permission
        </h1>
        <div className="grow"></div>
      </div>

      <div className="p-4 bg-white rounded-md shadow-md m-4">
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

        <div className="flex gap-8 border-b border-gray-200 pb-2 mb-2 px-16">
          <p className="flex-1 text-sm text-gray-500">
            (a) Assessed or held for the purpose of agriculture/for the
            non-agriculture purpose /purpose of.
          </p>
          <div className="flex-1">{formdata.data!.q1 ? "Yes" : "No"}</div>
        </div>

        <div className="flex gap-8 border-b border-gray-200 pb-2 mb-2 px-16">
          <p className="flex-1 text-sm text-gray-500">
            (b) Assessed or held for the non-agriculture purpose of
          </p>
          <div className="flex-1">{formdata.data!.q2}</div>
        </div>

        <div className="flex gap-8 border-b border-gray-200 pb-2 mb-2 px-16">
          <p className="flex-1 text-sm text-gray-500">
            (c) Assessed or held for the non-agriculture purpose but in
            relaxation of condition on the time of grant of land or permission
            for such non-agricultural use Viz
          </p>
          <div className="flex-1">{formdata.data!.q3}</div>
        </div>

        <div className="bg-gray-100 px-4 py-1 my-2 mx-4 text-sm">
          Annexure Details
        </div>
        <div className="flex gap-8 border-b border-gray-200 pb-2 mb-2 px-16">
          <p className="text-sm text-gray-700">
            Annexure 1: Application for Non-Agricultural Permission
          </p>
          <div className="grow"></div>

          <Link
            target="_blank"
            href={`${baseurl}/${formdata.data!.anx1}`}
            className="bg-gray-200 text-black py-1 px-4 rounded-md text-sm h-8 grid place-items-center"
          >
            View File
          </Link>
        </div>
        <div className="flex gap-8 border-b border-gray-200 pb-2 mb-2 px-16">
          <p className="text-sm text-gray-700">Annexure 2: Land Records</p>
          <div className="grow"></div>

          <Link
            target="_blank"
            href={`${baseurl}/${formdata.data!.anx2}`}
            className="bg-gray-200 text-black py-1 px-4 rounded-md text-sm h-8 grid place-items-center"
          >
            View File
          </Link>
        </div>
        <div className="flex gap-8 border-b border-gray-200 pb-2 mb-2 px-16">
          <p className="text-sm text-gray-700">Annexure 3: Land Records</p>
          <div className="grow"></div>

          <Link
            target="_blank"
            href={`${baseurl}/${formdata.data!.anx3}`}
            className="bg-gray-200 text-black py-1 px-4 rounded-md text-sm h-8 grid place-items-center"
          >
            View File
          </Link>
        </div>
        <div className="flex gap-8 border-b border-gray-200 pb-2 mb-2 px-16">
          <p className="text-sm text-gray-700">Annexure 4: Land Records</p>
          <div className="grow"></div>

          <Link
            target="_blank"
            href={`${baseurl}/${formdata.data!.anx4}`}
            className="bg-gray-200 text-black py-1 px-4 rounded-md text-sm h-8 grid place-items-center"
          >
            View File
          </Link>
        </div>
        <div className="flex gap-8 border-b border-gray-200 pb-2 mb-2 px-16">
          <p className="text-sm text-gray-700">Annexure 5: Land Records</p>
          <div className="grow"></div>

          <Link
            target="_blank"
            href={`${baseurl}/${formdata.data!.anx5}`}
            className="bg-gray-200 text-black py-1 px-4 rounded-md text-sm h-8 grid place-items-center"
          >
            View File
          </Link>
        </div>
        <div className="bg-gray-100 px-4 py-1 my-2 mx-4 text-sm">
          Also furnish the following information
        </div>

        <div className="flex gap-8 border-b border-gray-200 pb-2 mb-2 px-16">
          <p className="flex-1 text-sm text-gray-500">
            (1). First Name of the Applicant.
          </p>
          <div className="flex-1">{formdata.data!.q4}</div>
        </div>
        <div className="flex gap-8 border-b border-gray-200 pb-2 mb-2 px-16">
          <p className="flex-1 text-sm text-gray-500">
            (2). Last Name of the Applicant.
          </p>
          <div className="flex-1">{formdata.data!.last_name}</div>
        </div>

        <div className="flex gap-8 border-b border-gray-200 pb-2 mb-2 px-16">
          <p className="flex-1 text-sm text-gray-500">
            (3). Full Postal Address.
          </p>
          <div className="flex-1">{formdata.data!.q5}</div>
        </div>
        <div className="flex gap-8 border-b border-gray-200 pb-2 mb-2 px-16">
          <p className="flex-1 text-sm text-gray-500">
            (4). Contact no of the applicant.
          </p>
          <div className="flex-1">{formdata.data!.q6}</div>
        </div>
        <h1 className="bg-gray-100 px-4 py-1 my-2 mx-4 text-sm">
          Additonal Applicant Details
        </h1>

        <div className="overflow-x-auto mx-16 border-b border-gray-200 pb-2 mb-2">
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
              </tr>
            </thead>
            <tbody>
              {formdata.data!.na_applicant.map((field, index) => (
                <tr key={index}>
                  <td className="border border-gray-300 p-1">
                    <p>{field.firstName}</p>
                  </td>
                  <td className="border border-gray-300 p-1">
                    <p>{field.lastName}</p>
                  </td>
                  <td className="border border-gray-300 p-1">
                    <p>{field.contact}</p>
                  </td>
                  <td className="border border-gray-300 p-1">
                    <p>{field.relation}</p>
                  </td>
                  <td className="border border-gray-300 p-1 flex gap-2 items-center">
                    <Link
                      target="_blank"
                      href={`${baseurl}/${field.signature_url}`}
                      className="bg-gray-200 text-black py-1 px-4 rounded-md text-sm h-8 grid place-items-center"
                    >
                      View Signature
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex gap-8 border-b border-gray-200 pb-2 mb-2 px-16 ">
          <p className="flex-1 text-sm text-gray-500">(5) Village</p>
          <div className="flex-1">{formdata.data!.village.name}</div>
        </div>
        <div className="flex gap-8 border-b border-gray-200 pb-2 mb-2 px-16">
          <p className="flex-1 text-sm text-gray-500">(6) Survey No</p>
          <div className="flex-1">{formdata.data!.q7}</div>
        </div>
        <div className="flex gap-8 border-b border-gray-200 pb-2 mb-2 px-16">
          <p className="flex-1 text-sm text-gray-500">(7) Sub Division</p>
          <div className="flex-1">{formdata.data!.q8}</div>
        </div>

        <div className="flex gap-8 border-b border-gray-200 pb-2 mb-2 px-16">
          <p className="flex-1 text-sm text-gray-500">(8) Area in Sq.mt.</p>
          <div className="flex-1">{formdata.data!.q9}</div>
        </div>
        <div className="flex gap-8 border-b border-gray-200 pb-2 mb-2 px-16">
          <p className="flex-1 text-sm text-gray-500">(9) Old Survey No</p>
          <div className="flex-1">{formdata.data!.q10}</div>
        </div>

        <h1 className="bg-gray-100 px-4 py-1 my-2 mx-4 text-sm">
          Survey Details
        </h1>
        <div className="overflow-x-auto px-16 border-b border-gray-200 pb-2 mb-2">
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
                <th className="border border-gray-300 px-4 py-2 font-normal text-sm w-40">
                  Village
                </th>
              </tr>
            </thead>
            <tbody>
              {formdata.data!.na_survey.map((field, index) => (
                <tr key={index}>
                  <td className="border border-gray-300 px-4 py-2">
                    <p>{field.survey_no}</p>
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <p>{field.area} Sq.mt.</p>
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <p>{field.sub_division}</p>
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    <p>{field.village.name}</p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex gap-8 border-b border-gray-200 pb-2 mb-2 px-16">
          <p className="flex-1 text-sm text-gray-500">
            (10) Area of the site out of (6) above to be used for.
          </p>
          <div className="flex-1">{formdata.data!.q11}</div>
        </div>
        <div className="flex gap-8 border-b border-gray-200 pb-2 mb-2 px-16">
          <p className="flex-1 text-sm text-gray-500">
            (11) Type (Residential/Commercial/Industrial)
          </p>
          <div className="flex-1">{formdata.data!.q12}</div>
        </div>
        <div className="flex gap-8 border-b border-gray-200 pb-2 mb-2 px-16">
          <p className="flex-1 text-sm text-gray-500">
            (12) Present use of the land and whether any building exists thereon
            and if so, it's use.
          </p>
          <div className="flex-1">{formdata.data!.q13}</div>
        </div>
        <div className="flex gap-8 border-b border-gray-200 pb-2 mb-2 px-16">
          <p className="flex-1 text-sm text-gray-500">
            (13) Whether electrical light transmission lines pass over the land
            and if so, the distance thereof from the proposed building other
            works.
          </p>
          <div className="flex-1">{formdata.data!.q14}</div>
        </div>
        <div className="flex gap-8 border-b border-gray-200 pb-2 mb-2 px-16">
          <p className="flex-1 text-sm text-gray-500">
            (14) Is, the land under acquisition. If so, state details.
          </p>
          <div className="flex-1">{formdata.data!.q15}</div>
        </div>
        <div className="flex gap-8 border-b border-gray-200 pb-2 mb-2 px-16">
          <p className="flex-1 text-sm text-gray-500">
            (15) Is there a road from where the land is easily accessible ?
            State the name of the road and whether it is Highway, Major district
            road or village road. What is the distance of the proposed building
            or other work from the center of the road.
          </p>
          <div className="flex-1">{formdata.data!.q16}</div>
        </div>
        <div className="flex gap-8 border-b border-gray-200 pb-2 mb-2 px-16">
          <p className="flex-1 text-sm text-gray-500">
            (16) If there is no road adjoining the land, how is it proposed to
            be provided for access to the site.
          </p>
          <div className="flex-1">{formdata.data!.q17}</div>
        </div>
        <div className="flex gap-8 border-b border-gray-200 pb-2 mb-2 px-16">
          <p className="flex-1 text-sm text-gray-500">
            (17) Was a similar application made in the past for non-agricultural
            use of this land and was it rejected If yes, give details.
          </p>
          <div className="flex-1">{formdata.data!.q18}</div>
        </div>
      </div>
      <div className="flex gap-2">
        <div className="grow"></div>
        <button
          type="reset"
          onClick={(e) => {
            e.preventDefault();
            router.back();
            // router.push(`/dashboard/user/na-permission/edit/${encryptURLData(formid.toString())}`);
          }}
          className="py-1 rounded-md bg-rose-500 px-4 text-sm text-white mt-2 cursor-pointer"
        >
          Back
        </button>

        <button
          type="submit"
          onClick={(e) => {
            e.preventDefault();
            submitnaform.mutate();
          }}
          className="py-1 rounded-md bg-blue-500 px-4 text-sm text-white mt-2 cursor-pointer"
        >
          Submit
        </button>
      </div>
    </div>
  );
};

export default ViewPermission;
