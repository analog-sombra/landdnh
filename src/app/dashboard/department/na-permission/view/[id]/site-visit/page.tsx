"use client";
import { ApiCall, UploadFile } from "@/services/api";
import { baseurl } from "@/utils/const";
import { decryptURLData } from "@/utils/methods";
import { valibotResolver } from "@hookform/resolvers/valibot";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button, Card, Modal, Spin, Upload } from "antd";
import { UploadFile as AntdUploadFile } from "antd/es/upload/interface";
import { getCookie } from "cookies-next/client";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import * as v from "valibot";

const SiteVisitFormSchema = v.object({
  remarks1: v.optional(v.string()),
  remarks2: v.optional(v.string()),
  latitude: v.optional(v.string()),
  longitude: v.optional(v.string()),
});

type SiteVisitForm = v.InferInput<typeof SiteVisitFormSchema>;

const SiteVisitPage = () => {
  const router = useRouter();
  const { id } = useParams<{ id: string | string[] }>();
  const idString = Array.isArray(id) ? id[0] : id;
  const formid: number = parseInt(decryptURLData(idString, router));
  const userid = getCookie("id");

  const [uploadedFiles, setUploadedFiles] = useState<
    { file: AntdUploadFile; url: string }[]
  >([]);
  const [uploading, setUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const formMethods = useForm<SiteVisitForm>({
    resolver: valibotResolver(SiteVisitFormSchema),
  });

  const { control, handleSubmit, watch, setValue } = formMethods;

  // Helper function to get full image URL
  const getImageUrl = (path: string | null) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    return `${baseurl}/${path}`;
  };

  // Helper function to get relative path from URL
  const getRelativePath = (url: string) => {
    if (!url) return null;
    // If it starts with baseurl, remove it
    if (url.startsWith(baseurl)) {
      return url.substring(baseurl.length + 1); // +1 to remove the leading slash
    }
    // Otherwise it's already a relative path
    return url;
  };

  // Fetch existing site visit data if it exists
  const existingSiteVisit = useQuery({
    queryKey: ["getNaSiteVisitByFormId", formid],
    queryFn: async () => {
      const response = await ApiCall({
        query: `query GetNaSiteVisitByFormId($na_formId: Int!) {
          getNaSiteVisitByFormId(na_formId: $na_formId) {
            id
            remarks1
            remarks2
            latitude
            longitude
            image_1
            image_2
            image_3
            image_4
            image_5
          }
        }`,
        variables: {
          na_formId: formid,
        },
      });

      if (!response.status) {
        throw new Error(response.message);
      }

      if (
        !(response.data as Record<string, unknown>)["getNaSiteVisitByFormId"]
      ) {
        return null;
      }
      return (response.data as Record<string, unknown>)[
        "getNaSiteVisitByFormId"
      ] as {
        id: number;
        remarks1: string | null;
        remarks2: string | null;
        latitude: number | null;
        longitude: number | null;
        image_1: string | null;
        image_2: string | null;
        image_3: string | null;
        image_4: string | null;
        image_5: string | null;
      }[];
    },
  });

  // Populate form with existing data
  useEffect(() => {
    if (existingSiteVisit.data && existingSiteVisit.data.length > 0) {
      const data = existingSiteVisit.data[0];
      setValue("remarks1", data.remarks1 ?? "");
      setValue("remarks2", data.remarks2 ?? "");
      setValue("latitude", data.latitude ? data.latitude.toString() : "");
      setValue("longitude", data.longitude ? data.longitude.toString() : "");

      // Set uploaded files
      const files = [];
      if (data.image_1) {
        const imageUrl = getImageUrl(data.image_1);
        files.push({
          file: {
            uid: "1",
            name: "image_1",
            status: "done",
            url: imageUrl,
          } as AntdUploadFile,
          url: imageUrl,
        });
      }
      if (data.image_2) {
        const imageUrl = getImageUrl(data.image_2);
        files.push({
          file: {
            uid: "2",
            name: "image_2",
            status: "done",
            url: imageUrl,
          } as AntdUploadFile,
          url: imageUrl,
        });
      }
      if (data.image_3) {
        const imageUrl = getImageUrl(data.image_3);
        files.push({
          file: {
            uid: "3",
            name: "image_3",
            status: "done",
            url: imageUrl,
          } as AntdUploadFile,
          url: imageUrl,
        });
      }
      if (data.image_4) {
        const imageUrl = getImageUrl(data.image_4);
        files.push({
          file: {
            uid: "4",
            name: "image_4",
            status: "done",
            url: imageUrl,
          } as AntdUploadFile,
          url: imageUrl,
        });
      }
      if (data.image_5) {
        const imageUrl = getImageUrl(data.image_5);
        files.push({
          file: {
            uid: "5",
            name: "image_5",
            status: "done",
            url: imageUrl,
          } as AntdUploadFile,
          url: imageUrl,
        });
      }
      setUploadedFiles(files);
    }
  }, [existingSiteVisit.data, setValue]);

  const handleFileUpload = async (file: File) => {
    console.log("Handling file upload for:", file);
    if (uploadedFiles.length >= 5) {
      toast.error("Maximum 5 images allowed");
      return false;
    }

    const fileSize = (file.size ?? 0) / 1024 / 1024; // Convert to MB
    if (fileSize > 2) {
      toast.error("Each image must be 2 MB or smaller");
      return false;
    }

    setUploading(true);
    try {
      console.log("File to upload:", file);
      const response = await UploadFile(file, "site_visit");
      console.log("Upload response:", response);

      if (response.status) {
        const relativePath: string = response.data as string;
        console.log("Relative path:", relativePath);
        const fileUrl = getImageUrl(relativePath);
        console.log("File URL:", fileUrl);
        // Create a file-like object for preview
        const fileObj: AntdUploadFile = {
          uid: `-${Date.now()}`,
          name: file.name,
          status: "done",
          url: fileUrl,
          thumbUrl: fileUrl,
        };
        setUploadedFiles([...uploadedFiles, { file: fileObj, url: fileUrl }]);
        toast.success("Image uploaded successfully");
      } else {
        toast.error(response.message || "Upload failed");
      }
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setUploading(false);
    }

    return false;
  };

  const handleRemoveFile = (index: number) => {
    setUploadedFiles(uploadedFiles.filter((_, i) => i !== index));
  };

  const handleAutoDetect = () => {
    setValue("latitude", "20.3653924");
    setValue("longitude", "72.9212597");
    toast.success("Location set successfully");
  };

  const createSiteVisit = useMutation({
    mutationFn: async (data: SiteVisitForm) => {
      if (!userid) {
        throw new Error("User ID not found");
      }

      if (uploadedFiles.length === 0) {
        throw new Error("Please upload at least one image");
      }

      const response = await ApiCall({
        query: `mutation CreateNaSiteVisit($createNaSiteVisitInput: CreateNaSiteVisitInput!) {
          createNaSiteVisit(createNaSiteVisitInput: $createNaSiteVisitInput) {
            id
          }
        }`,
        variables: {
          createNaSiteVisitInput: {
            na_formId: formid,
            remarks1: data.remarks1 || null,
            remarks2: data.remarks2 || null,
            latitude: data.latitude ? parseFloat(data.latitude) : null,
            longitude: data.longitude ? parseFloat(data.longitude) : null,
            image_1: uploadedFiles[0]
              ? getRelativePath(uploadedFiles[0].url)
              : null,
            image_2: uploadedFiles[1]
              ? getRelativePath(uploadedFiles[1].url)
              : null,
            image_3: uploadedFiles[2]
              ? getRelativePath(uploadedFiles[2].url)
              : null,
            image_4: uploadedFiles[3]
              ? getRelativePath(uploadedFiles[3].url)
              : null,
            image_5: uploadedFiles[4]
              ? getRelativePath(uploadedFiles[4].url)
              : null,
            createdById: parseInt(userid.toString()),
          },
        },
      });

      if (!response.status) {
        throw new Error(response.message);
      }

      if (!(response.data as Record<string, unknown>)["createNaSiteVisit"]) {
        throw new Error("Failed to create site visit");
      }

      return (response.data as Record<string, unknown>)["createNaSiteVisit"];
    },
    onSuccess: () => {
      toast.success("Site visit recorded successfully");
      router.back();
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const onSubmit = async (data: SiteVisitForm) => {
    createSiteVisit.mutate(data);
  };

  if (existingSiteVisit.isLoading) {
    return (
      <div className="w-full h-screen grid place-items-center">
        <Spin size="large" />
      </div>
    );
  }

  // Check if data exists
  const hasExistingData =
    existingSiteVisit.data && existingSiteVisit.data.length > 0;
  const data = hasExistingData ? existingSiteVisit.data![0] : null;

  // VIEW MODE - Show existing data
  if (hasExistingData && data) {
    return (
      <div className="py-4 px-4 grid place-items-center">
        <div className="flex gap-2 items-center mb-6 w-full">
          <h1 className="text-[#162f57] text-2xl font-semibold">
            Site Visit Report
          </h1>
          <div className="grow"></div>
          <button
            onClick={() => router.back()}
            className="bg-gray-300 text-gray-700 py-1 px-4 rounded-md text-sm hover:bg-gray-400 transition"
          >
            Back
          </button>
        </div>

        <Card className="shadow-md w-3/6 mx-auto">
          <div className="bg-[#162f57] text-white px-6 py-4 rounded-t-md mb-6 -mx-6 -mt-6">
            <p className="text-sm">Site Visit Report - View Mode</p>
          </div>

          {/* Remarks 1 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Site Visit Remarks 1
            </label>
            <div className="p-3 bg-gray-50 border border-gray-300 rounded-md text-sm text-gray-800">
              {data.remarks1 || <span className="text-gray-500 italic">No remarks provided</span>}
            </div>
          </div>

          {/* Remarks 2 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Site Visit Remarks 2
            </label>
            <div className="p-3 bg-gray-50 border border-gray-300 rounded-md text-sm text-gray-800">
              {data.remarks2 || <span className="text-gray-500 italic">No remarks provided</span>}
            </div>
          </div>

          {/* Site Visit Images */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Site Visit Images
            </label>
            {[data.image_1, data.image_2, data.image_3, data.image_4, data.image_5].filter(Boolean).length > 0 ? (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                  {[data.image_1, data.image_2, data.image_3, data.image_4, data.image_5].map(
                    (image, index) =>
                      image && (
                        <div
                          key={index}
                          className="group relative border border-gray-300 rounded-md overflow-hidden cursor-pointer hover:shadow-lg transition"
                          onClick={() => setSelectedImage(getImageUrl(image))}
                        >
                          <img
                            src={getImageUrl(image)}
                            alt={`Image ${index + 1}`}
                            className="w-full h-24 object-cover transition"
                          />
                          {/* <div className="absolute inset-0 hidden group-hover:flex items-center justify-center bg-black bg-opacity-20">
                            <span className="text-white text-2xl">🔍</span>
                          </div> */}
                        </div>
                      )
                  )}
                </div>
                
                {/* Image Preview Modal */}
                <Modal
                  open={!!selectedImage}
                  onCancel={() => setSelectedImage(null)}
                  footer={null}
                  width={900}
                  centered
                  styles={{ body: { padding: 0 } }}
                >
                  <img
                    src={selectedImage || ""}
                    alt="Full preview"
                    style={{ width: "100%", height: "auto" }}
                  />
                </Modal>
              </>
            ) : (
              <div className="p-3 bg-gray-50 border border-gray-300 rounded-md text-sm text-gray-500 italic">
                No images uploaded
              </div>
            )}
          </div>

          {/* GPS Coordinates */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              GPS Coordinates
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-600 mb-2">Latitude</label>
                <div className="p-3 bg-gray-50 border border-gray-300 rounded-md text-sm text-gray-800">
                  {data.latitude || <span className="text-gray-500 italic">Not provided</span>}
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-2">Longitude</label>
                <div className="p-3 bg-gray-50 border border-gray-300 rounded-md text-sm text-gray-800">
                  {data.longitude || <span className="text-gray-500 italic">Not provided</span>}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-center pt-6 border-t border-gray-200">
            <button
              onClick={() => router.back()}
              className="bg-gray-300 text-gray-700 py-2 px-8 rounded-md font-medium hover:bg-gray-400 transition"
            >
              Back
            </button>
          </div>
        </Card>
      </div>
    );
  }

  // CREATE MODE - Show form
  return (
    <div className="py-4 px-4  grid place-items-center">
      <div className="flex gap-2 items-center mb-6 w-full">
        <h1 className="text-[#162f57] text-2xl font-semibold">
          Site Visit Report
        </h1>
        <div className="grow"></div>
        <button
          onClick={() => router.back()}
          className="bg-gray-300 text-gray-700 py-1 px-4 rounded-md text-sm hover:bg-gray-400 transition"
        >
          Back
        </button>
      </div>

      <Card className="shadow-md w-3/6 mx-auto">
        <div className="bg-[#162f57] text-white px-6 py-4 rounded-t-md mb-6 -mx-6 -mt-6">
          <p className="text-sm">All fields marked * are required</p>
        </div>

        <FormProvider {...formMethods}>
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Remarks 1 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Site Visit Remarks 1<span className="text-red-500">*</span>
              </label>
              <textarea
                {...formMethods.register("remarks1")}
                placeholder="Describe the site visit observations and findings in detail"
                className="w-full h-24 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#162f57] text-sm"
              />
              {formMethods.formState.errors.remarks1 && (
                <p className="text-red-500 text-xs mt-1">
                  {formMethods.formState.errors.remarks1.message}
                </p>
              )}
              <div className="text-right text-gray-500 text-xs mt-1">
                {watch("remarks1")?.length || 0} / 1000
              </div>
            </div>

            {/* Remarks 2 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Site Visit Remarks 2<span className="text-red-500">*</span>
              </label>
              <textarea
                {...formMethods.register("remarks2")}
                placeholder="Additional remarks or observations"
                className="w-full h-24 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#162f57] text-sm"
              />
              {formMethods.formState.errors.remarks2 && (
                <p className="text-red-500 text-xs mt-1">
                  {formMethods.formState.errors.remarks2.message}
                </p>
              )}
              <div className="text-right text-gray-500 text-xs mt-1">
                {watch("remarks2")?.length || 0} / 1000
              </div>
            </div>

            {/* Site Visit Images */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Site Visit Images<span className="text-red-500">*</span>
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-md p-4 text-center bg-gray-50 mb-4">
                <Upload
                  accept="image/*"
                  maxCount={5}
                  beforeUpload={handleFileUpload}
                  showUploadList={false}
                  disabled={uploadedFiles.length >= 5 || uploading}
                >
                  <div className="cursor-pointer">
                    <div className="text-4xl text-[#162f57]">📷</div>
                    <p className="text-gray-700 font-medium">
                      Click or drag images to upload
                    </p>
                    <p className="text-gray-500 text-sm mt-1">
                      Supports multiple images. Each image must be 2 MB or
                      smaller.
                    </p>
                    <p className="text-gray-500 text-sm">
                      {uploadedFiles.length} / 5 images selected
                    </p>
                  </div>
                </Upload>
              </div>

              {/* Uploaded Files Preview */}
              {uploadedFiles.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                  {uploadedFiles.map((item, index) => (
                    <div
                      key={index}
                      className="relative border border-gray-300 rounded-md overflow-hidden"
                    >
                      <img
                        src={`${item.url}`}
                        alt={`Upload ${index + 1}`}
                        className="w-full h-24 object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveFile(index)}
                        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* GPS Coordinates */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-4">
                GPS Coordinates<span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-2">
                <div>
                  <label className="block text-xs text-gray-600 mb-2">
                    Latitude
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 28.6139"
                    step="0.0000000001"
                    {...formMethods.register("latitude")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#162f57] text-sm"
                  />
                  {formMethods.formState.errors.latitude && (
                    <p className="text-red-500 text-xs mt-1">
                      {formMethods.formState.errors.latitude.message}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-2">
                    Longitude
                  </label>
                  <input
                    type="number"
                    placeholder="e.g. 77.2090"
                    step="0.0000000001"
                    {...formMethods.register("longitude")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#162f57] text-sm"
                  />
                  {formMethods.formState.errors.longitude && (
                    <p className="text-red-500 text-xs mt-1">
                      {formMethods.formState.errors.longitude.message}
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  onClick={handleAutoDetect}
                  className="bg-[#162f57] mt-5 h-10 text-white py-2 px-4 rounded-md text-sm hover:bg-[#1a3a6b] transition flex items-center gap-2"
                >
                  📍 Auto-Detect Location
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex gap-3 justify-center pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={() => router.back()}
                className="bg-gray-300 text-gray-700 py-2 px-8 rounded-md font-medium hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={
                  createSiteVisit.isPending ||
                  uploading ||
                  uploadedFiles.length === 0
                }
                className="bg-[#162f57] text-white py-2 px-8 rounded-md font-medium hover:bg-[#1a3a6b] transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {createSiteVisit.isPending || uploading ? (
                  <>
                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Submitting...
                  </>
                ) : (
                  "Submit Site Visit Report"
                )}
              </button>
            </div>
          </form>
        </FormProvider>
      </Card>
    </div>
  );
};

export default SiteVisitPage;
