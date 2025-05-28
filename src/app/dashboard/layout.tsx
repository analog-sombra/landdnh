"use client";

import Sidebar from "@/components/dashboard/sidebar";
import { MaterialSymbolsKeyboardDoubleArrowRight } from "@/components/icons";
import { useState } from "react";

const Layout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <>
      <div className="min-h-screen w-full bg-[#f3f6f8] relative">
        <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} role="USER" />

        <div className={`relative p-0 md:pl-60 min-h-screen w-full`}>
          <div className="pb-8">{children}</div>
          <div className="bg-white md:ml-60 h-8 bottom-0 left-0 right-0 absolute flex items-center">
            <p className="text-sm  px-2">Land Section</p> |
            <div className="text-gray-500 text-xs flex items-center px-2">
              © {new Date().getFullYear()} copyright
            </div>{" "}
            |
            <div className="text-gray-500 text-xs flex items-center px-2">
              Version: 1.0.0
            </div>
            <div className="grow"></div>
            <p className="px-2">
              SmartTechWebworks
            </p>
          </div>
        </div>
        {isOpen && (
          <div
            role="button"
            onClick={() => setIsOpen(false)}
            className="block md:hidden fixed top-0 left-0 bg-black opacity-25 h-screen w-full z-10"
          ></div>
        )}

        {!isOpen && (
          <div
            className="md:hidden fixed top-[50%]  left-0 w-6 h-6 translate-y-[-50%] bg-blue-500 grid place-items-center z-10 transition-all duration-300 ease-in-out rounded-e-full"
            onClick={() => setIsOpen(true)}
            role="button"
          >
            <MaterialSymbolsKeyboardDoubleArrowRight className="text-white  text-2xl " />
          </div>
        )}
      </div>
    </>
  );
};

export default Layout;
