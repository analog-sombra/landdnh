"use client";
import { Collapse, Tabs, TabsProps } from "antd";

const Meeting = () => {
  const onChange = (key: string) => {
    console.log(key);
  };

  const data = [
    {
      key: "1",
      label: "Defendant information",
      children: (
        <div className="p-1 grid grid-cols-4 gap-6 justify-between">
          <div>
            <p className="text-sm">Home Address</p>
            <p className="text-sm  font-medium">
              2736 ALMADEN STREET, SAN JOSE, CA 95124
            </p>
          </div>
          <div>
            <p className="text-sm">Maling Address</p>
            <p className="text-sm  font-medium">Same as home</p>
          </div>
          <div>
            <p className="text-sm">Home Phone</p>
            <p className="text-sm  font-medium">None</p>
          </div>
          <div>
            <p className="text-sm">Mobile Number</p>
            <p className="text-sm  font-medium">(444) 555-1234</p>
          </div>
          <div>
            <p className="text-sm">Email</p>
            <p className="text-sm  font-medium">maxwell@somewhere.com</p>
          </div>
          <div>
            <p className="text-sm">Date of birth</p>
            <p className="text-sm  font-medium">July 30, 1992</p>
          </div>
        </div>
      ),
    },
    {
      key: "2",
      label: "Cases on the docket",
      children: (
        <div className="p-1 grid grid-cols-4 gap-6 justify-between">
          <div>
            <p className="text-sm">Address</p>
            <p className="text-sm  font-medium">
              15MC0010-1 | 5 123 - BEHICLE PROH PULBIC PARKING
            </p>
          </div>
          <div>
            <p className="text-sm">Status</p>
            <p className="text-sm  font-medium">FIRST NOTICE DATE</p>
          </div>
          <div>
            <p className="text-sm">DATE</p>
            <p className="text-sm  font-medium">3/17/2020 8:00 AM</p>
          </div>
          <div>
            <p className="text-sm">BALANCE</p>
            <p className="text-sm  font-medium">$50.00</p>
          </div>
          <div>
            <p className="text-sm">Email</p>
            <p className="text-sm  font-medium">text@somewhere.com</p>
          </div>
        </div>
      ),
    },
  ];

  const items = [
    {
      key: "1",
      label: "CASE INFO",
      children: (
        <>
          <div className="flex items-center mb-4">
            <div className="bg-blue-500 grid place-items-center text-lg rounded-full h-10 w-10 text-white font-semibold">
              MB
            </div>
            <div className="ml-4">
              <p className="text-lg">MAXWELL BJORCK</p>
              <p className="text-gray-700 text-sm">ADOCT</p>
            </div>
          </div>
          <Collapse
            items={data}
            defaultActiveKey={["1", "2"]}
          />
        </>
      ),
    },
    {
      key: "2",
      label: "DOCUMENTS",
      children: "Content of Tab Pane 2",
    },
    {
      key: "3",
      label: "SCREEN SHARE",
      children: "Content of Tab Pane 3",
    },
  ];

  return (
    <div className="p-6 grid grid-cols-12 gap-2 min-h-screen">
      <div className="bg-white shadow rounded p-2 col-span-9 flex flex-col">
        <div className="flex-1 flex flex-col">
          <Tabs defaultActiveKey="1" items={items} onChange={onChange} />
        </div>
      </div>
      <div className="bg-white shadow rounded p-2 col-span-3">
        <p className="text-sm">Maxwell B Jorck: Check in </p>
        <p className="text-sm">Concerns: I Have a photo to share </p>
      </div>
    </div>
  );
};

export default Meeting;
