import { NaProvider } from "@/components/form/user/na";

const AddNaPermission = () => {
  return (
    <>
      <div className="pt-4">
        <h1 className="text-[#162f57] text-2xl font-semibold mx-4">
          Apply For NA Permission
        </h1>
        <NaProviderEdit />
      </div>
    </>
  );
};

export default AddNaPermission;
