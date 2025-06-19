import { FluentEdit48Regular, FluentEye32Regular } from "@/components/icons";

const UserServicesPage = () => {
  const data = [
    {
      sr: "I",
      code: "NA",
      service: "Non Agricultural Permission",
      viewLink: "/dashboard/user/na-permission",
      applyLink: "/dashboard/user/na-permission/add",
    },
    {
      sr: "II",
      code: "GP",
      service: "Gift Permission",
      viewLink: "/dashboard/user/gift-permission",
      applyLink: "/dashboard/user/gift-permission",
    },
    {
      sr: "III",
      code: "PP",
      service: "Partition Permission",
      viewLink: "/dashboard/user/partition-permission",
      applyLink: "/dashboard/user/partition-permission",
    },
    {
      sr: "IV",
      code: "SD",
      service: "Sub Division Permission",
      viewLink: "/dashboard/user/subdivistion-permission",
      applyLink: "/dashboard/user/subdivistion-permission",
    },
    {
      sr: "V",
      code: "SP",
      service: "Sale Permission",
      viewLink: "/dashboard/user/sale-permission",
      applyLink: "/dashboard/user/sale-permission",
    },
  ];
  return (
    <>
      <div className="pt-4">
        <p className="text-lg font-semibold mt-4 mx-4">Select Service</p>
        <div className="bg-white rounded mx-4 text-xs shadow border-t-2 border-blue-500 ">
          <table border={1} className="mx-auto w-full">
            <tbody className="w-full">
              <tr className="w-full bg-blue-500 text-white">
                <td className="px-2 text-xs leading-6 w-[10%]">Sr No</td>
                <td className="px-2 text-xs leading-6 w-[10%]">Code</td>
                <td className="px-2 text-xs leading-6 w-[60%]">
                  Land Section Service(s)
                </td>
                <td className="px-2 text-xs leading-6 w-[20%]">Action</td>
              </tr>

              {data.map((item, index) => (
                <tr
                  key={index}
                  className={`w-full border-b border-gray-200 hover:bg-gray-100 ${
                    index % 2 === 0 ? "bg-gray-50" : "bg-white"
                  }`}
                >
                  <td className="px-2 text-xs leading-6 w-[10%] text-center">
                    {item.sr}
                  </td>
                  <td className="px-2 text-xs leading-6 w-[10%] text-center">
                    {item.code}
                  </td>
                  <td className="px-2 text-xs leading-6 w-[60%]">
                    {item.service}
                  </td>
                  <td className="px-2 text-xs leading-6 w-[20%] py-1 flex flex-row items-center gap-2">
                    <a
                      href={item.viewLink}
                      className="text-white bg-blue-500 h-6 px-3 rounded flex items-center gap-1"
                    >
                      <FluentEye32Regular />
                      View
                    </a>
                    <a
                      href={item.applyLink}
                      className="text-white bg-blue-500 h-6 px-3 rounded flex items-center gap-1"
                    >
                      <FluentEdit48Regular />
                      Apply
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* table end here */}
        </div>
      </div>
    </>
  );
};

export default UserServicesPage;
