"use client";

import { encryptURLData } from "@/utils/methods";
import { Button, Input, Card, Space, Tag, message } from "antd";
import { useState } from "react";
import Link from "next/link";

export default function TestPage() {
  const [obpsId, setObpsId] = useState("");
  const [encryptedId, setEncryptedId] = useState("");
  const [generatedUrl, setGeneratedUrl] = useState("");

  const handleGenerate = () => {
    if (!obpsId.trim()) {
      message.error("Please enter an OBPS ID number");
      return;
    }

    if (isNaN(Number(obpsId))) {
      message.error("Please enter a valid number");
      return;
    }

    try {
      const encrypted = encryptURLData(obpsId);
      setEncryptedId(encrypted);
      setGeneratedUrl(`/dashboard/report/${encrypted}`);
      message.success("Encrypted ID generated successfully!");
    } catch (error) {
      message.error("Failed to encrypt ID");
      console.error(error);
    }
  };

  const handleCopyToClipboard = () => {
    const fullUrl = `${window.location.origin}${generatedUrl}`;
    navigator.clipboard.writeText(fullUrl);
    message.success("URL copied to clipboard!");
  };

  const handleCopyEncrypted = () => {
    navigator.clipboard.writeText(encryptedId);
    message.success("Encrypted ID copied to clipboard!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <Card 
          className="shadow-xl rounded-lg"
          style={{ borderTop: "4px solid #3b82f6" }}
        >
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              OBPS URL Generator
            </h1>
            <p className="text-gray-600">
              Generate encrypted URLs for OBPS reports using OBPS ID numbers
            </p>
          </div>

          <Space direction="vertical" style={{ width: "100%" }} size="large">
            {/* Input Section */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Enter OBPS ID Number
              </label>
              <Input
                type="number"
                placeholder="Enter OBPS ID (e.g., 1, 2, 3...)"
                value={obpsId}
                onChange={(e) => setObpsId(e.target.value)}
                onPressEnter={handleGenerate}
                size="large"
                className="rounded-lg"
              />
            </div>

            {/* Generate Button */}
            <div className="flex gap-2">
              <Button
                type="primary"
                onClick={handleGenerate}
                size="large"
                className="flex-1 bg-blue-500 hover:bg-blue-600"
              >
                Generate Encrypted URL
              </Button>
            </div>

            {/* Results Section */}
            {encryptedId && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-4">
                <Tag color="green" className="text-base py-1 px-3">
                  ✓ Successfully Generated
                </Tag>

                {/* Encrypted ID */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Encrypted ID
                  </label>
                  <div className="flex gap-2">
                    <Input
                      value={encryptedId}
                      readOnly
                      className="rounded-lg bg-gray-100"
                      size="large"
                    />
                    <Button
                      onClick={handleCopyEncrypted}
                      title="Copy encrypted ID"
                      size="large"
                    />
                  </div>
                </div>

                {/* Generated URL Path */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    URL Path
                  </label>
                  <div className="flex gap-2">
                    <Input
                      value={generatedUrl}
                      readOnly
                      className="rounded-lg bg-gray-100"
                      size="large"
                    />
                    <Button
                      onClick={handleCopyToClipboard}
                      title="Copy full URL"
                      size="large"
                    />
                  </div>
                </div>

                {/* Full URL */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Full URL
                  </label>
                  <div className="bg-white p-3 rounded-lg border border-gray-200 overflow-x-auto text-sm break-all">
                    <code className="text-blue-600">
                      {`${window.location.origin}${generatedUrl}`}
                    </code>
                  </div>
                </div>

                {/* Access Link */}
                <div className="flex gap-2">
                  <Link
                    href={generatedUrl}
                    className="flex-1"
                  >
                    <Button
                      type="primary"
                      size="large"
                      className="w-full bg-green-500 hover:bg-green-600"
                    >
                      Access OBPS Report
                    </Button>
                  </Link>
                </div>
              </div>
            )}

            {/* Info Section */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-2">ℹ️ How it works:</h3>
              <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
                <li>Enter your OBPS ID number in the input field above</li>
                <li>Click "Generate Encrypted URL" to create the encrypted link</li>
                <li>Copy the URL or click "Access OBPS Report" to view the report</li>
                <li>The encrypted ID protects the OBPS entry from being accessed directly</li>
              </ul>
            </div>
          </Space>
        </Card>
      </div>
    </div>
  );
}
