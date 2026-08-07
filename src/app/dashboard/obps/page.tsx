import { ObpsProvider } from "@/components/form/user/obps";

const AddObps = () => {
  return (
    <>
      <div className="pt-4">
        <h1 className="text-[#162f57] text-2xl font-semibold mx-4">
          Create OBPS Application
        </h1>
        <ObpsProvider />
      </div>
    </>
  );
};

export default AddObps;
