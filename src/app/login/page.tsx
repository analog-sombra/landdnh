"use client";

import LoginPage from "@/components/form/login/login";

export default function Home() {
  return (
    <div className="relative h-screen w-full">
      <div className="relative">
        <img
          src="/loginbg.jpg"
          alt="Login Background"
          className="absolute inset-0 object-cover w-full h-screen"
        />
      </div>

      <div className="w-full h-screen bg-gradient-to-b from-[#080C0A] to-[#244F4C] opacity-75 relative"></div>

      <div className="w-full h-screen grid place-items-center top-0 left-0 absolute">
        <div className="flex ">
          <div className="w-96 bg-[#D1DBA3] p-8 grid place-items-center rounded-l-lg">
            <div className="relative w-40 h-40">
              <img src="/logo.png" alt="Logo" className="w-full h-full" />
            </div>
            <p className="text-center text-2xl text-[#244F4C] font-semibold mt-4">
              U.T. Government of
              <br />
              Dadra & Nagar Haveli
              <br />
              and Daman & Diu
            </p>
            {/* <p className="text-center text-[#244F4C] text-2xl font-bold">
              Bhumi Seva
            </p> */}
          </div>
          <div className="p-5 bg-white w-96 rounded-r-lg grid place-items-center">
            <div>
              <p className="text-center text-2xl text-[#244F4C]">Login</p>
              <p className="text-center">
                Enter your username and password to login
              </p>
              <LoginPage />
            </div>
          </div>
        </div>
      </div>
      {/* <div className="grid place-items-center h-screen w-full bg-gray-100">
        <div className="p-5 bg-white shadow w-96 rounded-xl">
          <p className="text-center text-xl">Login</p>
          <p className="text-center">
            Enter your username and password to login
          </p>
          <LoginPage />
        </div>
      </div> */}
    </div>
  );
}
