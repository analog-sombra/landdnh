"use client";

import RegisterPage from "@/components/form/register/register";

export default function Home() {
  return (
    <div className="grid place-items-center h-screen w-full bg-gray-100">
      <div className="p-5 bg-white shadow w-96 rounded-xl">
        <p className="text-center text-xl">Register</p>
        <p className="text-center">Enter your username and password to register</p>
        <RegisterPage />
      </div>
    </div>
  );
}
