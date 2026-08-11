"use client";

import { Collapse, Button, Table, Tag } from "antd";
import Link from "next/link";
import { ArrowLeftOutlined } from "@ant-design/icons";

export default function DocumentChecklistPage() {
  // Document categories for different conversion types
  const documentCategories = [
    {
      key: "1",
      label: "Unauthorized Land Conversion Documents",
      children: (
        <div className="space-y-4">
          <p className="text-[#334155] font-semibold mb-4">
            Required documents for unauthorized land conversion:
          </p>
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-[#f0f9ff]">
                <th className="border border-[#e2e8f0] px-4 py-3 text-left font-bold text-[#1e3a8a]">
                  Document Name
                </th>
                <th className="border border-[#e2e8f0] px-4 py-3 text-left font-bold text-[#1e3a8a]">
                  Format
                </th>
                <th className="border border-[#e2e8f0] px-4 py-3 text-left font-bold text-[#1e3a8a]">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                {
                  doc: "Land Ownership Deed",
                  format: "PDF/Image",
                  status: "Mandatory",
                },
                {
                  doc: "Current Land Survey Report",
                  format: "PDF",
                  status: "Mandatory",
                },
                {
                  doc: "Affidavit (Current & Proposed Use)",
                  format: "PDF",
                  status: "Mandatory",
                },
                {
                  doc: "Identity Proof (Aadhar/PAN)",
                  format: "PDF/Image",
                  status: "Mandatory",
                },
                {
                  doc: "Address Proof",
                  format: "PDF/Image",
                  status: "Mandatory",
                },
                {
                  doc: "Site Plan/Sketch",
                  format: "PDF/Image",
                  status: "Mandatory",
                },
                {
                  doc: "Government Property Card",
                  format: "PDF/Image",
                  status: "Optional",
                },
                {
                  doc: "Previous NA Certificate (if any)",
                  format: "PDF",
                  status: "Optional",
                },
              ].map((row, idx) => (
                <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-[#f9fafb]"}>
                  <td className="border border-[#e2e8f0] px-4 py-3 text-[#334155]">
                    {row.doc}
                  </td>
                  <td className="border border-[#e2e8f0] px-4 py-3 text-[#334155]">
                    {row.format}
                  </td>
                  <td className="border border-[#e2e8f0] px-4 py-3">
                    <Tag
                      color={row.status === "Mandatory" ? "red" : "blue"}
                      className="font-semibold"
                    >
                      {row.status}
                    </Tag>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ),
    },
    {
      key: "2",
      label: "Damanganga Irrigation Land Conversion Documents",
      children: (
        <div className="space-y-4">
          <p className="text-[#334155] font-semibold mb-4">
            Required documents for Damanganga irrigation zone conversion:
          </p>
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-[#f0fdf4]">
                <th className="border border-[#e2e8f0] px-4 py-3 text-left font-bold text-[#065f46]">
                  Document Name
                </th>
                <th className="border border-[#e2e8f0] px-4 py-3 text-left font-bold text-[#065f46]">
                  Format
                </th>
                <th className="border border-[#e2e8f0] px-4 py-3 text-left font-bold text-[#065f46]">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                {
                  doc: "Land Ownership Deed",
                  format: "PDF/Image",
                  status: "Mandatory",
                },
                {
                  doc: "Current Land Survey Report",
                  format: "PDF",
                  status: "Mandatory",
                },
                {
                  doc: "Irrigation Department NOC",
                  format: "PDF",
                  status: "Mandatory",
                },
                {
                  doc: "Affidavit (Current & Proposed Use)",
                  format: "PDF",
                  status: "Mandatory",
                },
                {
                  doc: "Identity Proof (Aadhar/PAN)",
                  format: "PDF/Image",
                  status: "Mandatory",
                },
                {
                  doc: "Address Proof",
                  format: "PDF/Image",
                  status: "Mandatory",
                },
                {
                  doc: "Site Plan/Sketch",
                  format: "PDF/Image",
                  status: "Mandatory",
                },
                {
                  doc: "Irrigation Certificate from Land Records",
                  format: "PDF",
                  status: "Mandatory",
                },
                {
                  doc: "Environmental Clearance (if required)",
                  format: "PDF",
                  status: "Optional",
                },
              ].map((row, idx) => (
                <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-[#f9fafb]"}>
                  <td className="border border-[#e2e8f0] px-4 py-3 text-[#334155]">
                    {row.doc}
                  </td>
                  <td className="border border-[#e2e8f0] px-4 py-3 text-[#334155]">
                    {row.format}
                  </td>
                  <td className="border border-[#e2e8f0] px-4 py-3">
                    <Tag
                      color={row.status === "Mandatory" ? "red" : "blue"}
                      className="font-semibold"
                    >
                      {row.status}
                    </Tag>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ),
    },
    {
      key: "3",
      label: "Residential Land Conversion Documents",
      children: (
        <div className="space-y-4">
          <p className="text-[#334155] font-semibold mb-4">
            Required documents for residential land conversion:
          </p>
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-[#fffbf0]">
                <th className="border border-[#e2e8f0] px-4 py-3 text-left font-bold text-[#d97706]">
                  Document Name
                </th>
                <th className="border border-[#e2e8f0] px-4 py-3 text-left font-bold text-[#d97706]">
                  Format
                </th>
                <th className="border border-[#e2e8f0] px-4 py-3 text-left font-bold text-[#d97706]">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                {
                  doc: "Land Ownership Deed",
                  format: "PDF/Image",
                  status: "Mandatory",
                },
                {
                  doc: "Current Land Survey Report",
                  format: "PDF",
                  status: "Mandatory",
                },
                {
                  doc: "Affidavit (Residential Conversion)",
                  format: "PDF",
                  status: "Mandatory",
                },
                {
                  doc: "Identity Proof (Aadhar/PAN)",
                  format: "PDF/Image",
                  status: "Mandatory",
                },
                {
                  doc: "Address Proof",
                  format: "PDF/Image",
                  status: "Mandatory",
                },
                {
                  doc: "Site Plan/Sketch (with residential layout)",
                  format: "PDF/Image",
                  status: "Mandatory",
                },
                {
                  doc: "Municipal/Local Authority NOC",
                  format: "PDF",
                  status: "Mandatory",
                },
                {
                  doc: "Architectural Plan (if applicable)",
                  format: "PDF",
                  status: "Optional",
                },
                {
                  doc: "Environmental Impact Assessment",
                  format: "PDF",
                  status: "Optional",
                },
              ].map((row, idx) => (
                <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-[#f9fafb]"}>
                  <td className="border border-[#e2e8f0] px-4 py-3 text-[#334155]">
                    {row.doc}
                  </td>
                  <td className="border border-[#e2e8f0] px-4 py-3 text-[#334155]">
                    {row.format}
                  </td>
                  <td className="border border-[#e2e8f0] px-4 py-3">
                    <Tag
                      color={row.status === "Mandatory" ? "red" : "blue"}
                      className="font-semibold"
                    >
                      {row.status}
                    </Tag>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ),
    },
    {
      key: "4",
      label: "Commercial Land Conversion Documents",
      children: (
        <div className="space-y-4">
          <p className="text-[#334155] font-semibold mb-4">
            Required documents for commercial land conversion:
          </p>
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-[#fffbf0]">
                <th className="border border-[#e2e8f0] px-4 py-3 text-left font-bold text-[#d97706]">
                  Document Name
                </th>
                <th className="border border-[#e2e8f0] px-4 py-3 text-left font-bold text-[#d97706]">
                  Format
                </th>
                <th className="border border-[#e2e8f0] px-4 py-3 text-left font-bold text-[#d97706]">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                {
                  doc: "Land Ownership Deed",
                  format: "PDF/Image",
                  status: "Mandatory",
                },
                {
                  doc: "Current Land Survey Report",
                  format: "PDF",
                  status: "Mandatory",
                },
                {
                  doc: "Affidavit (Commercial Conversion)",
                  format: "PDF",
                  status: "Mandatory",
                },
                {
                  doc: "Business Registration/GST Certificate",
                  format: "PDF",
                  status: "Mandatory",
                },
                {
                  doc: "Identity Proof (Aadhar/PAN)",
                  format: "PDF/Image",
                  status: "Mandatory",
                },
                {
                  doc: "Address Proof",
                  format: "PDF/Image",
                  status: "Mandatory",
                },
                {
                  doc: "Site Plan (Commercial Layout)",
                  format: "PDF/Image",
                  status: "Mandatory",
                },
                {
                  doc: "Municipal/Local Authority NOC",
                  format: "PDF",
                  status: "Mandatory",
                },
                {
                  doc: "Fire Safety NOC",
                  format: "PDF",
                  status: "Mandatory",
                },
                {
                  doc: "Environmental Clearance",
                  format: "PDF",
                  status: "Mandatory",
                },
                {
                  doc: "Architectural Plan",
                  format: "PDF",
                  status: "Optional",
                },
              ].map((row, idx) => (
                <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-[#f9fafb]"}>
                  <td className="border border-[#e2e8f0] px-4 py-3 text-[#334155]">
                    {row.doc}
                  </td>
                  <td className="border border-[#e2e8f0] px-4 py-3 text-[#334155]">
                    {row.format}
                  </td>
                  <td className="border border-[#e2e8f0] px-4 py-3">
                    <Tag
                      color={row.status === "Mandatory" ? "red" : "blue"}
                      className="font-semibold"
                    >
                      {row.status}
                    </Tag>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ),
    },
    {
      key: "5",
      label: "Industrial Land Conversion Documents",
      children: (
        <div className="space-y-4">
          <p className="text-[#334155] font-semibold mb-4">
            Required documents for industrial land conversion:
          </p>
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-[#fffbf0]">
                <th className="border border-[#e2e8f0] px-4 py-3 text-left font-bold text-[#d97706]">
                  Document Name
                </th>
                <th className="border border-[#e2e8f0] px-4 py-3 text-left font-bold text-[#d97706]">
                  Format
                </th>
                <th className="border border-[#e2e8f0] px-4 py-3 text-left font-bold text-[#d97706]">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {[
                {
                  doc: "Land Ownership Deed",
                  format: "PDF/Image",
                  status: "Mandatory",
                },
                {
                  doc: "Current Land Survey Report",
                  format: "PDF",
                  status: "Mandatory",
                },
                {
                  doc: "Affidavit (Industrial Conversion)",
                  format: "PDF",
                  status: "Mandatory",
                },
                {
                  doc: "Business Registration/Industrial License",
                  format: "PDF",
                  status: "Mandatory",
                },
                {
                  doc: "Identity Proof (Aadhar/PAN)",
                  format: "PDF/Image",
                  status: "Mandatory",
                },
                {
                  doc: "Address Proof",
                  format: "PDF/Image",
                  status: "Mandatory",
                },
                {
                  doc: "Industrial Site Plan",
                  format: "PDF/Image",
                  status: "Mandatory",
                },
                {
                  doc: "Municipal/Local Authority NOC",
                  format: "PDF",
                  status: "Mandatory",
                },
                {
                  doc: "Environmental Impact Assessment",
                  format: "PDF",
                  status: "Mandatory",
                },
                {
                  doc: "Pollution Control Board Clearance",
                  format: "PDF",
                  status: "Mandatory",
                },
                {
                  doc: "Fire Safety NOC",
                  format: "PDF",
                  status: "Mandatory",
                },
                {
                  doc: "Industry Classification Certificate",
                  format: "PDF",
                  status: "Optional",
                },
              ].map((row, idx) => (
                <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-[#f9fafb]"}>
                  <td className="border border-[#e2e8f0] px-4 py-3 text-[#334155]">
                    {row.doc}
                  </td>
                  <td className="border border-[#e2e8f0] px-4 py-3 text-[#334155]">
                    {row.format}
                  </td>
                  <td className="border border-[#e2e8f0] px-4 py-3">
                    <Tag
                      color={row.status === "Mandatory" ? "red" : "blue"}
                      className="font-semibold"
                    >
                      {row.status}
                    </Tag>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ),
    },
  ];

  const items = documentCategories.map((category) => ({
    key: category.key,
    label: (
      <span className="font-semibold text-base text-[#1e3a8a] hover:text-[#1e40af]">
        {category.label}
      </span>
    ),
    children: category.children,
    style: {
      marginBottom: "16px",
    },
    className: "doc-item",
  }));

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Header */}
      <header className="bg-white px-[5%] py-4 border-b-4 border-[#1e3a8a] shadow-sm flex justify-between items-center">
        <div className="flex items-center gap-4">
          <img
            src="/logo.png"
            alt="Emblem"
            className="w-15 h-15 rounded"
          />
          <div>
            <h1 className="text-xl text-[#1e3a8a] font-bold">
              BHOOMISEVA Portal
            </h1>
            <p className="text-xs text-[#64748b]">
              Land Use Conversion | Revenue Department, DNH & DD
            </p>
          </div>
        </div>
        <div className="text-sm text-[#64748b]">
          Helpline: <span className="font-semibold">0260-2230003</span>
        </div>
      </header>

      {/* Main Content */}
      <section className="px-[5%] py-12">
        <div className="max-w-5xl mx-auto">
          {/* Page Header */}
          <div className="mb-12">
            <h2 className="text-4xl text-[#1e3a8a] font-bold mb-3">
              Document Checklist
            </h2>
            <p className="text-[#334155] text-base leading-relaxed">
              Comprehensive document checklist for different types of NA land
              conversion. Select your conversion type to view the required
              documents. All documents must be uploaded in PDF or image format
              (max 5MB each). <span className="font-semibold">Red tags</span>{" "}
              indicate mandatory documents, while{" "}
              <span className="font-semibold">blue tags</span> indicate optional
              documents.
            </p>
          </div>

          {/* Important Notes */}
          <div className="bg-[#fffbf0] border-l-4 border-[#d97706] p-6 rounded-lg mb-8">
            <h4 className="text-lg font-bold text-[#d97706] mb-3">
              Important Notes:
            </h4>
            <ul className="list-disc list-inside space-y-2 text-[#334155]">
              <li>
                All documents must be certified/attested copies from authorized
                government offices
              </li>
              <li>
                Maximum file size for each document is 5MB. Accepted formats:
                PDF, JPG, PNG
              </li>
              <li>
                Original documents must be submitted physically at the Revenue
                Office for final verification
              </li>
              <li>
                Incomplete or incorrect documents may lead to rejection of your
                application
              </li>
              <li>
                For any clarifications, contact our helpline: 0260-2230003
              </li>
            </ul>
          </div>

          {/* Document Categories */}
          <div className="mb-16">
            <h3 className="text-2xl text-[#1e3a8a] font-bold mb-6">
              Required Documents by Conversion Type
            </h3>
            <div className="bg-white rounded-lg p-6 shadow-md border border-[#e2e8f0]">
              <Collapse
                items={items}
                style={{
                  background: "transparent",
                  border: "none",
                }}
                accordion={false}
              />
            </div>
            <style jsx>{`
              :global(.doc-item > .ant-collapse-header) {
                padding: 16px 20px !important;
                background: linear-gradient(135deg, #f0f9ff 0%, #ffffff 100%) !important;
                border-radius: 8px !important;
                margin-bottom: 12px !important;
                border-left: 4px solid #1e3a8a !important;
                transition: all 0.3s ease !important;
              }

              :global(.doc-item > .ant-collapse-header:hover) {
                background: linear-gradient(135deg, #e0f2fe 0%, #f0f9ff 100%) !important;
                box-shadow: 0 2px 8px rgba(30, 58, 138, 0.1) !important;
              }

              :global(.doc-item .ant-collapse-content) {
                background: #ffffff !important;
                border-radius: 0 0 8px 8px !important;
                border: 1px solid #e2e8f0 !important;
                border-top: none !important;
                margin-bottom: 12px !important;
              }

              :global(.doc-item .ant-collapse-content-box) {
                padding: 20px !important;
              }

              :global(.doc-item.ant-collapse-item-active > .ant-collapse-header) {
                border-left: 4px solid #d97706 !important;
              }
            `}</style>
          </div>

          {/* Document Submission Tips */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden border border-[#e2e8f0]">
            <div
              className="px-8 py-6 border-b-4 border-[#1e3a8a]"
              style={{ backgroundColor: "#f0f9ff" }}
            >
              <h3 className="text-2xl text-[#1e3a8a] font-bold">
                Document Submission Tips
              </h3>
            </div>

            <div className="p-8 space-y-6">
              <div>
                <h4 className="text-lg font-bold text-[#1e3a8a] mb-3">
                  📄 Document Quality
                </h4>
                <p className="text-[#334155] leading-relaxed mb-2">
                  Ensure all documents are clear, legible, and properly scanned.
                  For images, use good lighting and maintain proper orientation.
                  Blurry or upside-down images may be rejected.
                </p>
              </div>

              <div>
                <h4 className="text-lg font-bold text-[#1e3a8a] mb-3">
                  ✓ Verification
                </h4>
                <p className="text-[#334155] leading-relaxed mb-2">
                  All documents must be self-certified by the applicant or
                  officially certified by the issuing authority. Photocopies
                  without certification are not acceptable.
                </p>
              </div>

              <div>
                <h4 className="text-lg font-bold text-[#1e3a8a] mb-3">
                  📅 Currency of Documents
                </h4>
                <p className="text-[#334155] leading-relaxed mb-2">
                  Documents should be recent (not older than 6 months for most
                  documents). Land survey reports should be from the current
                  fiscal year. Expired documents will be rejected.
                </p>
              </div>

              <div>
                <h4 className="text-lg font-bold text-[#1e3a8a] mb-3">
                  🔐 File Security
                </h4>
                <p className="text-[#334155] leading-relaxed mb-2">
                  All uploaded documents are encrypted and stored securely. Your
                  personal information is protected under government data
                  protection policies.
                </p>
              </div>

              <div>
                <h4 className="text-lg font-bold text-[#1e3a8a] mb-3">
                  ❓ Need Help?
                </h4>
                <p className="text-[#334155] leading-relaxed">
                  For detailed information about specific documents or help with
                  document preparation, visit our{" "}
                  <Link href="/faq" className="text-[#1e3a8a] font-semibold hover:underline">
                    User Manual & FAQs
                  </Link>{" "}
                  page or contact our support team.
                </p>
              </div>
            </div>
          </div>

          {/* Footer Navigation */}
          <div className="mt-12 p-8 bg-[#f0f9ff] rounded-lg border-2 border-[#1e3a8a]">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-bold text-lg text-[#1e3a8a] mb-2">
                  Ready to Apply?
                </h4>
                <p className="text-[#334155] mb-4">
                  Gather all required documents and start your NA permission
                  application today.
                </p>
              </div>
              <Link href="/">
                <Button
                  type="primary"
                  size="large"
                  className="bg-[#1e3a8a] h-12 text-base font-semibold flex items-center gap-2"
                  icon={<ArrowLeftOutlined />}
                >
                  Back to Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
