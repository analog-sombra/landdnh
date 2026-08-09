"use client";

import LoginPage from "@/components/form/login/login";

const colors = {
  primary: "#1e3a8a",
  secondary: "#065f46",
  accent: "#d97706",
  bgLight: "#f8fafc",
  textDark: "#0f172a",
  borderColor: "#e2e8f0",
};

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Accessibility Bar */}
      {/* <div className="bg-[#0f172a] text-white px-[5%] py-1.5 text-xs flex justify-between items-center">
        <div>Government of India | U.T. Administration</div>
        <div className="space-x-3">
          <a href="#" className="text-[#cbd5e1] hover:text-white">Skip to Main Content</a>
          <span className="text-[#cbd5e1]">|</span>
          <a href="#" className="text-[#cbd5e1] hover:text-white">Screen Reader</a>
          <span className="text-[#cbd5e1]">|</span>
          <a href="#" className="text-[#cbd5e1] hover:text-white font-semibold">ગુજરાતી</a>
          <span className="text-[#cbd5e1]">|</span>
          <a href="#" className="text-[#cbd5e1] hover:text-white font-semibold">हिन्दी</a>
        </div>
      </div> */}

      {/* Header */}
      <header className="bg-white px-[5%] py-4 border-b-4 border-[#1e3a8a] shadow-sm flex justify-between items-center">
        <div className="flex items-center gap-4">
          <img
            src="/logo.png"
            alt="Emblem"
            className="w-15 h-15 rounded"
          />
          <div>
            <h1 className="text-xl text-[#1e3a8a] font-bold">BHOOMISEVA Portal</h1>
            <p className="text-xs text-[#64748b]">Land Use Conversion | Revenue Department, DNH & DD</p>
          </div>
        </div>
        <div className="text-sm text-[#64748b]">
          Helpline: <span className="font-semibold">0260-2230003</span>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-[#f0f9ff] to-[#e0f2fe] px-[5%] py-10 border-b border-[#e2e8f0]">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          {/* Hero Text */}
          <div>
            <h2 className="text-4xl text-[#1e3a8a] font-bold mb-3">
              Digital Land Use Conversion Portal
            </h2>
            <p className="text-[#334155] text-lg mb-6">
              Apply for Non-Agricultural permission online, calculate statutory revenue fees, track real-time application processing, and issue e-Signed clearance certificates.
            </p>

            {/* Quick Tracker */}
            <div className="bg-white p-4 rounded-lg border border-[#e2e8f0] flex gap-2 max-w-2xl shadow-md">
              <input
                type="text"
                placeholder="Enter Application Ref No. (e.g. DNH/NA/2026/0124)"
                className="flex-1 px-3.5 py-2.5 border border-[#cbd5e1] rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#1e3a8a]"
              />
              <button className="bg-[#1e3a8a] text-white px-5 py-2.5 rounded-md font-semibold cursor-pointer hover:bg-[#1e40af] text-sm">
                Track Status
              </button>
            </div>
          </div>

          {/* Login Card */}
          <div className="bg-white p-8 rounded-xl border border-[#e2e8f0] shadow-lg">
            {/* Login Tabs */}
            {/* <div className="flex border-b-2 border-[#e2e8f0] mb-5">
              <div className="flex-1 text-center py-2.5 font-semibold text-[#1e3a8a] cursor-pointer border-b-2 border-[#1e3a8a] -mb-0.5">
                OTP Login
              </div>
              <div className="flex-1 text-center py-2.5 font-semibold text-[#64748b] cursor-pointer">
                Password
              </div>
              <div className="flex-1 text-center py-2.5 font-semibold text-[#64748b] cursor-pointer">
                Official
              </div>
            </div> */}

            {/* Login Form */}
            <LoginPage />

            {/* Register Link */}
            {/* <p className="text-center mt-4 text-xs text-[#64748b]">
              New Citizen?{" "}
              <a href="/register" className="text-[#1e3a8a] font-semibold hover:underline">
                Register Account
              </a>
            </p> */}
          </div>
        </div>
      </section>

      {/* Pre-Login Citizen Corner */}
      <section className="px-[5%] py-10">
        <h3 className="text-center text-2xl text-[#1e3a8a] mb-8 font-bold">
          Pre-Login Citizen Corner
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Service Cards */}
          {[
            {
              title: "Document Checklist",
              desc: "View required documents by conversion type (Residential, Commercial, Industrial).",
            },
            {
              title: "NA Fee Calculator",
              desc: "Estimate conversion premium, tax, and application fees based on land area.",
            },
            {
              title: "Verify E-Certificate",
              desc: "Validate and download official QR-coded NA permission orders.",
            },
            {
              title: "User Manual & FAQs",
              desc: "Step-by-step guidance on application workflows and compliance timelines.",
            },
          ].map((service, idx) => (
            <div
              key={idx}
              className="bg-white p-6 rounded-lg border border-[#e2e8f0] text-center transition-all hover:shadow-md hover:-translate-y-1 cursor-pointer"
            >
              <h4 className="text-[#1e3a8a] font-semibold mb-2">{service.title}</h4>
              <p className="text-[#64748b] text-sm">{service.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
