"use client";

import { Collapse, Button } from "antd";
import Link from "next/link";
import { ArrowLeftOutlined } from "@ant-design/icons";

export default function FAQPage() {
  const faqs = [
    {
      key: "1",
      label: "What is the NA (Non-Agricultural) permission?",
      children: (
        <p className="text-[#334155] leading-relaxed">
          NA (Non-Agricultural) permission is an official authorization from the
          Revenue Department that allows landowners to convert agricultural land
          to non-agricultural uses such as residential, commercial, or
          industrial purposes. This is a mandatory requirement before any
          construction or land use change on agricultural land in the Dadra and
          Nagar Haveli region.
        </p>
      ),
    },
    {
      key: "2",
      label: "What are the different types of land conversion available?",
      children: (
        <p className="text-[#334155] leading-relaxed">
          The BHOOMISEVA Portal supports three main conversion types:
          <br />
          <strong>1. Unauthorized Land:</strong> For land that was previously
          used without proper permission.
          <br />
          <strong>2. Damanganga Irrigation:</strong> For agricultural land in
          irrigation zones that needs conversion.
          <br />
          <strong>3. Residential/Commercial/Industrial:</strong> For conversion
          to specific non-agricultural uses.
          <br />
          Each type has different fee structures and documentation requirements.
        </p>
      ),
    },
    {
      key: "3",
      label: "How do I apply for NA permission online?",
      children: (
        <p className="text-[#334155] leading-relaxed">
          To apply for NA permission:
          <br />
          1. Visit the BHOOMISEVA Portal and click on the login section.
          <br />
          2. Create an account or log in with your credentials.
          <br />
          3. Fill out the application form with required details including land
          survey number, area, and intended use.
          <br />
          4. Upload supporting documents (ownership proof, land survey report,
          etc.).
          <br />
          5. Pay the application fee using the online payment gateway.
          <br />
          6. Submit your application and note the reference number for tracking.
        </p>
      ),
    },
    {
      key: "4",
      label: "What documents are required for NA permission?",
      children: (
        <p className="text-[#334155] leading-relaxed">
          Required documents typically include:
          <br />
          • Land ownership proof (deed, property card, or government
          certificate)
          <br />
          • Latest land survey report with survey number and area details
          <br />
          • Affidavit stating the current and proposed land use
          <br />
          • Proof of applicant's identity and address (Aadhar, PAN, etc.)
          <br />
          • Site plan or sketch showing the land boundaries
          <br />
          • Clearance certificates from local authorities (if applicable)
          <br />
          • Fees receipt (if already paid at physical office)
          <br />
          For detailed document checklist, please visit the "Document Checklist"
          section on the portal homepage.
        </p>
      ),
    },
    {
      key: "5",
      label: "How do I calculate the NA conversion fees?",
      children: (
        <p className="text-[#334155] leading-relaxed">
          The BHOOMISEVA Portal provides an integrated NA Fee Calculator tool
          that helps you estimate the total fees:
          <br />
          1. Navigate to the "NA Fee Calculator" from the homepage.
          <br />
          2. Select the type of conversion (Unauthorized, Damanganga Irrigation,
          or Residential/Commercial/Industrial).
          <br />
          3. Enter the land area in square meters.
          <br />
          4. Click "Calculate" to view the breakdown of premium, tax, and
          application fees.
          <br />
          Note: These are estimates based on current rates. Actual fees may vary
          based on official assessment.
        </p>
      ),
    },
    {
      key: "6",
      label: "How long does it take to process my NA application?",
      children: (
        <p className="text-[#334155] leading-relaxed">
          The processing timeline depends on various factors:
          <br />• <strong>Initial Review:</strong> 5-7 working days
          <br />• <strong>Field Survey (if required):</strong> 7-14 working days
          <br />• <strong>Departmental Approval:</strong> 10-15 working days
          <br />• <strong>E-Certificate Generation:</strong> 2-3 working days
          <br />
          Total estimated time: 30-45 working days (may vary based on complexity
          and completeness of documents).
          <br />
          You can track your application status in real-time using the "Track
          Status" feature on the portal.
        </p>
      ),
    },
    {
      key: "7",
      label: "How do I track my NA application?",
      children: (
        <p className="text-[#334155] leading-relaxed">
          Tracking your application is easy:
          <br />
          1. On the portal homepage, locate the "Quick Tracker" section.
          <br />
          2. Enter your Application Reference Number (provided when you
          submitted your application).
          <br />
          3. Click "Track Status" to view the current status of your
          application.
          <br />
          4. You can see details like submission date, current processing stage,
          and estimated completion date.
          <br />
          5. You may also receive email/SMS notifications at each processing
          milestone.
        </p>
      ),
    },
    {
      key: "8",
      label: "What payment methods are accepted?",
      children: (
        <p className="text-[#334155] leading-relaxed">
          The BHOOMISEVA Portal accepts multiple payment methods:
          <br />• <strong>Net Banking:</strong> Direct bank transfer from your
          account
          <br />• <strong>Credit/Debit Card:</strong> Visa, Mastercard, and
          RuPay cards
          <br />• <strong>UPI:</strong> Google Pay, PhonePe, Paytm, and other
          UPI apps
          <br />• <strong>Digital Wallets:</strong> Paytm, Mobikwik, and other
          e-wallets
          <br />
          All transactions are secured with SSL encryption and comply with RBI
          guidelines.
        </p>
      ),
    },
    {
      key: "9",
      label: "Can I modify my application after submission?",
      children: (
        <p className="text-[#334155] leading-relaxed">
          Application modifications depend on the current processing stage:
          <br />• <strong>Before Review:</strong> You can modify most fields
          within 24 hours of submission.
          <br />• <strong>During Review:</strong> Limited modifications may be
          allowed with department approval.
          <br />• <strong>After Query:</strong> If a query is raised, you must
          respond with correct information within the specified timeframe.
          <br />• <strong>After Approval:</strong> No modifications are allowed.
          You must apply separately for amendments.
          <br />
          To request modifications, log in to your account and contact the
          support team through the portal.
        </p>
      ),
    },
    {
      key: "10",
      label: "How do I download my NA permission certificate?",
      children: (
        <p className="text-[#334155] leading-relaxed">
          Once your application is approved:
          <br />
          1. Log in to your BHOOMISEVA Portal account.
          <br />
          2. Navigate to "My Applications" or "Dashboard".
          <br />
          3. Select the approved application.
          <br />
          4. Click the "Download Certificate" button to get the e-Signed NA
          Permission Certificate.
          <br />
          5. The certificate includes QR code for verification and can be used
          for all government and private transactions.
          <br />
          6. You can also verify certificates using the "Verify E-Certificate"
          tool on the portal homepage.
        </p>
      ),
    },
  ];

  const items = faqs.map((faq) => ({
    key: faq.key,
    label: (
      <span className="font-semibold text-base text-[#1e3a8a] hover:text-[#1e40af]">
        {faq.label}
      </span>
    ),
    children: faq.children,
    style: {
      marginBottom: "16px",
    },
    className: "faq-item",
  }));

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Header */}
      <header className="bg-white px-[5%] py-4 border-b-4 border-[#1e3a8a] shadow-sm flex justify-between items-center">
        <div className="flex items-center gap-4">
          <img src="/logo.png" alt="Emblem" className="w-15 h-15 rounded" />
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
              User Manual & FAQs
            </h2>
            <p className="text-[#334155] text-base leading-relaxed">
              Find answers to frequently asked questions about the NA permission
              process, application procedures, fee calculations, and certificate
              verification. This comprehensive guide will help you navigate the
              BHOOMISEVA Portal smoothly.
            </p>
          </div>

          {/* FAQs Section */}
          <div className="mb-16">
            <h3 className="text-2xl text-[#1e3a8a] font-bold mb-6">
              Frequently Asked Questions
            </h3>
            <Collapse
              items={items}
              style={{
                background: "transparent",
                border: "none",
              }}
              accordion={false}
            />
            <style jsx>{`
              :global(.faq-item > .ant-collapse-header) {
                padding: 16px 20px !important;
                background: linear-gradient(
                  135deg,
                  #f0f9ff 0%,
                  #ffffff 100%
                ) !important;
                border-radius: 8px !important;
                margin-bottom: 12px !important;
                border-left: 4px solid #1e3a8a !important;
                transition: all 0.3s ease !important;
              }

              :global(.faq-item > .ant-collapse-header:hover) {
                background: linear-gradient(
                  135deg,
                  #e0f2fe 0%,
                  #f0f9ff 100%
                ) !important;
                box-shadow: 0 2px 8px rgba(30, 58, 138, 0.1) !important;
              }

              :global(.faq-item .ant-collapse-content) {
                background: #ffffff !important;
                border-radius: 0 0 8px 8px !important;
                border: 1px solid #e2e8f0 !important;
                border-top: none !important;
                margin-bottom: 12px !important;
              }

              :global(.faq-item .ant-collapse-content-box) {
                padding: 20px !important;
              }

              :global(
                .faq-item.ant-collapse-item-active > .ant-collapse-header
              ) {
                border-left: 4px solid #d97706 !important;
              }
            `}</style>
          </div>

          {/* User Manual Section */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden border border-[#e2e8f0]">
            <div
              className="px-8 py-6 border-b-4 border-[#1e3a8a]"
              style={{ backgroundColor: "#f0f9ff" }}
            >
              <h3 className="text-2xl text-[#1e3a8a] font-bold">
                Complete User Manual
              </h3>
            </div>

            <div className="p-8 space-y-8">
              {/* Getting Started */}
              <div>
                <h4 className="text-xl font-bold text-[#1e3a8a] mb-4">
                  1. Getting Started
                </h4>
                <p className="text-[#334155] leading-relaxed mb-3">
                  The BHOOMISEVA Portal is designed to simplify the
                  Non-Agricultural (NA) permission process. Before you begin,
                  ensure you have:
                </p>
                <ul className="list-disc list-inside space-y-2 text-[#334155]">
                  <li>Valid email ID and mobile number</li>
                  <li>
                    Land ownership documents (deed, property card, or government
                    certificate)
                  </li>
                  <li>Latest land survey report</li>
                  <li>Identity proof (Aadhar, PAN, or Voter ID)</li>
                  <li>Proof of address</li>
                </ul>
              </div>

              {/* Registration & Login */}
              <div>
                <h4 className="text-xl font-bold text-[#1e3a8a] mb-4">
                  2. Registration & Login
                </h4>
                <p className="text-[#334155] leading-relaxed mb-3">
                  <strong>Creating an Account:</strong>
                </p>
                <ol className="list-decimal list-inside space-y-2 text-[#334155] mb-4">
                  <li>Click on "Register" button on the login page</li>
                  <li>Enter your email ID and create a strong password</li>
                  <li>
                    Verify your email by clicking the link sent to your inbox
                  </li>
                  <li>
                    Complete your profile with personal and contact details
                  </li>
                  <li>Your account is now ready to use</li>
                </ol>
                <p className="text-[#334155] leading-relaxed">
                  <strong>Logging In:</strong> Use your registered email ID and
                  password to log in. If you forget your password, use the
                  "Forgot Password" option to reset it via email.
                </p>
              </div>

              {/* Applying for NA Permission */}
              <div>
                <h4 className="text-xl font-bold text-[#1e3a8a] mb-4">
                  3. Applying for NA Permission
                </h4>
                <p className="text-[#334155] leading-relaxed mb-3">
                  <strong>Step-by-Step Application Process:</strong>
                </p>
                <ol className="list-decimal list-inside space-y-3 text-[#334155]">
                  <li>
                    <strong>Select Application Type:</strong> Choose the type of
                    conversion (Unauthorized, Damanganga Irrigation, or specific
                    use like Residential/Commercial).
                  </li>
                  <li>
                    <strong>Enter Land Details:</strong> Provide survey number,
                    area (in sq.m), village name, and other location details.
                  </li>
                  <li>
                    <strong>Specify Land Use:</strong> Clearly state current and
                    proposed land use.
                  </li>
                  <li>
                    <strong>Upload Documents:</strong> Upload all required
                    documents in PDF or image format (max 5MB each).
                  </li>
                  <li>
                    <strong>Review Application:</strong> Check all details for
                    accuracy before submission.
                  </li>
                  <li>
                    <strong>Calculate Fees:</strong> The portal calculates the
                    required fees automatically.
                  </li>
                  <li>
                    <strong>Make Payment:</strong> Proceed to secure payment
                    gateway and complete the payment.
                  </li>
                  <li>
                    <strong>Submit Application:</strong> After successful
                    payment, submit your application.
                  </li>
                </ol>
              </div>

              {/* Using the Fee Calculator */}
              <div>
                <h4 className="text-xl font-bold text-[#1e3a8a] mb-4">
                  4. Using the NA Fee Calculator
                </h4>
                <p className="text-[#334155] leading-relaxed mb-3">
                  The NA Fee Calculator helps you estimate costs before
                  applying:
                </p>
                <ol className="list-decimal list-inside space-y-2 text-[#334155]">
                  <li>From the homepage, click on "NA Fee Calculator" card</li>
                  <li>
                    Select the type of conversion (Unauthorized Land, Damanganga
                    Irrigation, or Conversion Fees)
                  </li>
                  <li>Enter the land area in square meters</li>
                  <li>Click "Calculate" to see the fee breakdown</li>
                  <li>
                    The result shows: Conversion Premium, Tax (18%), and Total
                    Amount
                  </li>
                </ol>
              </div>

              {/* Tracking Your Application */}
              <div>
                <h4 className="text-xl font-bold text-[#1e3a8a] mb-4">
                  5. Tracking Your Application
                </h4>
                <p className="text-[#334155] leading-relaxed mb-3">
                  Monitor your application progress in real-time:
                </p>
                <ol className="list-decimal list-inside space-y-2 text-[#334155]">
                  <li>
                    Go to the homepage and locate the "Quick Tracker" section
                  </li>
                  <li>
                    Enter your Application Reference Number (provided in
                    confirmation email)
                  </li>
                  <li>Click "Track Status" to view current processing stage</li>
                  <li>
                    Check estimated completion date and any pending actions
                  </li>
                  <li>You'll receive notifications at each milestone</li>
                </ol>
              </div>

              {/* Document Verification */}
              <div>
                <h4 className="text-xl font-bold text-[#1e3a8a] mb-4">
                  6. Document Verification
                </h4>
                <p className="text-[#334155] leading-relaxed mb-3">
                  After approval, verify your e-certificate:
                </p>
                <ol className="list-decimal list-inside space-y-2 text-[#334155]">
                  <li>Click on "Verify E-Certificate" card on the homepage</li>
                  <li>Enter the certificate number or reference ID</li>
                  <li>
                    The certificate details will be displayed with QR code
                  </li>
                  <li>Download the PDF certificate for your records</li>
                  <li>Share the QR code for verification with others</li>
                </ol>
              </div>

              {/* Contact Support */}
              <div className="bg-[#f0f9ff] border-l-4 border-[#1e3a8a] p-6 rounded">
                <h4 className="text-xl font-bold text-[#1e3a8a] mb-3">
                  Need Additional Help?
                </h4>
                <p className="text-[#334155] leading-relaxed mb-4">
                  If you encounter any issues or have questions not covered in
                  this manual, please reach out to our support team:
                </p>
                <div className="space-y-2 text-[#334155]">
                  <p>
                    <strong>Helpline:</strong>{" "}
                    <span className="text-base font-semibold text-[#1e3a8a]">
                      0260-2230003
                    </span>
                  </p>
                  <p>
                    <strong>Email:</strong>{" "}
                    <span className="text-base font-semibold text-[#1e3a8a]">
                      support@bhoomiseva.in
                    </span>
                  </p>
                  <p>
                    <strong>Office Hours:</strong> Monday to Friday, 09:00 AM to
                    05:00 PM (IST)
                  </p>
                  <p>
                    <strong>Address:</strong> Revenue Department, Dadra and
                    Nagar Haveli Administration
                  </p>
                </div>
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
                  Head back to the portal and start your NA permission
                  application process today.
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
