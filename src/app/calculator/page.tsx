"use client";

import { useState } from "react";
import { InputNumber, Button, Alert, Tabs, Radio } from "antd";
import Link from "next/link";
import { toast } from "react-toastify";

interface PenaltyData {
  id: number;
  year: number;
  area: number;
  penalty?: number;
  assessment?: number;
  total?: number;
}

export default function CalculatorPage() {
  const [selectedTab, setSelectedTab] = useState<string>("unauthorized");
  const [unauthorizedData, setUnauthorizedData] = useState<PenaltyData[]>([
    { id: 1, year: 0, area: 0 },
  ]);
  const [irrigationData, setIrrigationData] = useState<PenaltyData[]>([
    { id: 1, year: 0, area: 0 },
  ]);
  const [conversionData, setConversionData] = useState<PenaltyData[]>([
    { id: 1, year: 0, area: 0 },
  ]);

  const [unauthorizedCalculated, setUnauthorizedCalculated] = useState(false);
  const [irrigationCalculated, setIrrigationCalculated] = useState(false);
  const [conversionCalculated, setConversionCalculated] = useState(false);

  const [unauthorizedNextId, setUnauthorizedNextId] = useState(2);
  const [irrigationNextId, setIrrigationNextId] = useState(2);
  const [conversionNextId, setConversionNextId] = useState(2);
  const [conversionType, setConversionType] = useState<string>("residential");

  // Conversion type rates
  const conversionRates: Record<string, number> = {
    residential: 25,
    "residential cum commercial": 40,
    commercial: 40,
    industrial: 50,
    "public offices, utilities": 10,
  };

  // Get current data based on selected tab
  const getCurrentData = () => {
    switch (selectedTab) {
      case "damanganga":
        return irrigationData;
      case "typewise":
        return conversionData;
      default:
        return unauthorizedData;
    }
  };

  const getCurrentCalculated = () => {
    switch (selectedTab) {
      case "damanganga":
        return irrigationCalculated;
      case "typewise":
        return conversionCalculated;
      default:
        return unauthorizedCalculated;
    }
  };

  const setCurrentData = (data: PenaltyData[] | ((prev: PenaltyData[]) => PenaltyData[])): void => {
    const newData = typeof data === "function" ? data(getCurrentData()) : data;
    switch (selectedTab) {
      case "damanganga":
        setIrrigationData(newData);
        break;
      case "typewise":
        setConversionData(newData);
        break;
      default:
        setUnauthorizedData(newData);
    }
  };

  const setCurrentCalculated = (value: boolean) => {
    switch (selectedTab) {
      case "damanganga":
        setIrrigationCalculated(value);
        break;
      case "typewise":
        setConversionCalculated(value);
        break;
      default:
        setUnauthorizedCalculated(value);
    }
  };

  const getCurrentNextId = () => {
    switch (selectedTab) {
      case "damanganga":
        return irrigationNextId;
      case "typewise":
        return conversionNextId;
      default:
        return unauthorizedNextId;
    }
  };

  const setCurrentNextId = (value: number) => {
    switch (selectedTab) {
      case "damanganga":
        setIrrigationNextId(value);
        break;
      case "typewise":
        setConversionNextId(value);
        break;
      default:
        setUnauthorizedNextId(value);
    }
  };

  const currentData = getCurrentData();
  const currentCalculated = getCurrentCalculated();
  const currentNextId = getCurrentNextId();

  const resetPenaltyData = () => {
    setCurrentData([{ id: 1, year: 0, area: 0 }]);
    setCurrentNextId(2);
    setCurrentCalculated(false);
  };

  const handleAddPenalty = () => {
    setCurrentData((prev: PenaltyData[]) => [
      ...prev,
      { id: currentNextId, year: 0, area: 0 },
    ]);
    setCurrentNextId(currentNextId + 1);
  };

  const handleRemovePenalty = (id: number) => {
    if (currentData.length > 1) {
      setCurrentData((prev: PenaltyData[]) => prev.filter((p: PenaltyData) => p.id !== id));
    }
  };

  const calculatePenalties = () => {
    let hasInvalidData = false;
    let errorMessage = "";

    if (selectedTab === "unauthorized") {
      hasInvalidData = currentData.some(
        (penalty) => penalty.year <= 0 || penalty.area <= 0
      );
      errorMessage = "Please enter valid year and area for all penalties";
    } else {
      // For damanganga and typewise tabs, only area is required
      hasInvalidData = currentData.some(
        (penalty) => penalty.area <= 0
      );
      errorMessage = "Please enter valid area for all entries";
    }

    if (hasInvalidData) {
      toast.error(errorMessage);
      return;
    }
    setCurrentCalculated(true);
  };

  const handleYearChange = (id: number, value: number | null): void => {
    const newData = currentData.map((p: PenaltyData) =>
      p.id === id ? { ...p, year: value || 0 } : p
    );
    setCurrentData(newData);
  };

  const handleAreaChange = (id: number, value: number | null): void => {
    const newData = currentData.map((p: PenaltyData) =>
      p.id === id ? { ...p, area: value || 0 } : p
    );
    setCurrentData(newData);
  };

  const getTabTitle = (): string => {
    switch (selectedTab) {
      case "damanganga":
        return "Damanganga Irrigation Penalty";
      case "typewise":
        return "Conversion Fees Penalty";
      default:
        return "Unauthorized Construction Penalty";
    }
  };

  const handleTabChange = (newTab: string): void => {
    setSelectedTab(newTab);
    // Reset calculated state for the new tab
    switch (newTab) {
      case "damanganga":
        setIrrigationCalculated(false);
        break;
      case "typewise":
        setConversionCalculated(false);
        break;
      default:
        setUnauthorizedCalculated(false);
    }
  };

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
            <h1 className="text-xl text-[#1e3a8a] font-bold">BHOOMISEVA Portal</h1>
            <p className="text-xs text-[#64748b]">Land Use Conversion | Revenue Department, DNH & DD</p>
          </div>
        </div>
        <div className="text-sm text-[#64748b]">
          Helpline: <span className="font-semibold">0260-2230003</span>
        </div>
      </header>

      {/* Main Content */}
      <section className="px-[5%] py-10">
        <div className="max-w-6xl mx-auto">
          {/* Tab Selector */}
          <div className="mb-6 bg-white rounded-lg p-4 shadow-sm border border-[#e2e8f0]">
            <Radio.Group
              options={[
                { label: "Unauthorized", value: "unauthorized" },
                { label: "Damanganga Irrigation", value: "damanganga" },
                { label: "Conversion Fees", value: "typewise" },
              ]}
              onChange={(e) => handleTabChange(e.target.value)}
              value={selectedTab}
              optionType="button"
              buttonStyle="solid"
              className="w-full"
            />
          </div>

          {/* Calculator Card */}
          <div className="bg-white rounded-lg shadow-md border border-[#e2e8f0] overflow-hidden">
            {/* Header */}
            <div className="px-6 py-4 bg-gradient-to-r from-[#f0f9ff] to-white border-b-4 border-[#1e3a8a]">
              <h2 className="text-2xl font-bold text-[#1e3a8a]">{getTabTitle()}</h2>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Conversion Type Selector (only for typewise) */}
              {selectedTab === "typewise" && (
                <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <label className="block text-sm font-semibold text-[#1e3a8a] mb-2">
                    Select Land Conversion Type:
                  </label>
                  <select
                    value={conversionType}
                    onChange={(e) => setConversionType(e.target.value)}
                    className="w-full p-2 border border-[#d1d5db] rounded-lg"
                    disabled={currentCalculated}
                  >
                    {Object.entries(conversionRates).map(([type, rate]) => (
                      <option key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)} - ₹{rate}/sq.m
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Action Buttons */}
              <div className="mb-4 flex justify-end gap-2">
                <Button
                  onClick={resetPenaltyData}
                  className="bg-gray-500 hover:bg-gray-600 text-white border-none"
                >
                  Reset
                </Button>
                <Button
                  type="primary"
                  onClick={handleAddPenalty}
                  className="bg-[#1e3a8a] hover:bg-[#1e40af]"
                >
                  Add Entry
                </Button>
              </div>

              {/* Table */}
              <div className="overflow-x-auto mb-4">
                <table className="w-full border-collapse border border-[#d1d5db]">
                  <thead>
                    <tr className="bg-[#f3f4f6]">
                      {selectedTab === "unauthorized" && (
                        <>
                          <th className="border border-[#d1d5db] px-4 py-3 text-left font-semibold text-[#1f2937]">
                            Year
                          </th>
                          <th className="border border-[#d1d5db] px-4 py-3 text-left font-semibold text-[#1f2937]">
                            Area (Sq.Mtrs)
                          </th>
                          <th className="border border-[#d1d5db] px-4 py-3 text-left font-semibold text-[#1f2937]">
                            Penalty
                          </th>
                          <th className="border border-[#d1d5db] px-4 py-3 text-left font-semibold text-[#1f2937]">
                            Assessment
                          </th>
                          <th className="border border-[#d1d5db] px-4 py-3 text-left font-semibold text-[#1f2937]">
                            Total
                          </th>
                        </>
                      )}
                      {selectedTab === "damanganga" && (
                        <>
                          <th className="border border-[#d1d5db] px-4 py-3 text-left font-semibold text-[#1f2937]">
                            Area (Sq.Mtrs)
                          </th>
                          <th className="border border-[#d1d5db] px-4 py-3 text-center font-semibold text-[#1f2937]">
                            Rate per Sq.Mtr
                          </th>
                          <th className="border border-[#d1d5db] px-4 py-3 text-left font-semibold text-[#1f2937]">
                            Total Fees
                          </th>
                        </>
                      )}
                      {selectedTab === "typewise" && (
                        <>
                          <th className="border border-[#d1d5db] px-4 py-3 text-left font-semibold text-[#1f2937]">
                            Area (Sq.Mtrs)
                          </th>
                          <th className="border border-[#d1d5db] px-4 py-3 text-center font-semibold text-[#1f2937]">
                            Rate per Sq.Mtr
                          </th>
                          <th className="border border-[#d1d5db] px-4 py-3 text-left font-semibold text-[#1f2937]">
                            Total Fees
                          </th>
                        </>
                      )}
                      <th className="border border-[#d1d5db] px-4 py-3 text-center font-semibold text-[#1f2937]">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentData.map((penalty, index) => {
                      let penaltyAmount = 0;
                      let assessmentAmount = 0;
                      let totalAmount = 0;
                      let feeAmount = 0;
                      const rate = selectedTab === "damanganga" ? 7 : conversionRates[conversionType];

                      if (selectedTab === "unauthorized") {
                        penaltyAmount = penalty.year * penalty.area * 0.02;
                        assessmentAmount = penaltyAmount * 400;
                        totalAmount = penaltyAmount + assessmentAmount;
                      } else if (selectedTab === "damanganga") {
                        feeAmount = penalty.area * 7;
                      } else if (selectedTab === "typewise") {
                        feeAmount = penalty.area * rate;
                      }

                      return (
                        <tr key={penalty.id} className="hover:bg-[#f9fafb]">
                          {selectedTab === "unauthorized" && (
                            <>
                              <td className="border border-[#d1d5db] px-4 py-3">
                                <InputNumber
                                  style={{ width: "100%" }}
                                  value={penalty.year}
                                  onChange={(val) => handleYearChange(penalty.id, val)}
                                  disabled={currentCalculated}
                                  placeholder="0"
                                />
                              </td>
                              <td className="border border-[#d1d5db] px-4 py-3">
                                <InputNumber
                                  style={{ width: "100%" }}
                                  value={penalty.area}
                                  onChange={(val) => handleAreaChange(penalty.id, val)}
                                  disabled={currentCalculated}
                                  placeholder="0"
                                />
                              </td>
                              <td className="border border-[#d1d5db] px-4 py-3 text-[#334155] font-medium">
                                {currentCalculated ? `₹${penaltyAmount.toFixed(2)}` : "-"}
                              </td>
                              <td className="border border-[#d1d5db] px-4 py-3 text-[#334155] font-medium">
                                {currentCalculated ? `₹${assessmentAmount.toFixed(2)}` : "-"}
                              </td>
                              <td className="border border-[#d1d5db] px-4 py-3 text-[#334155] font-semibold">
                                {currentCalculated ? `₹${totalAmount.toFixed(2)}` : "-"}
                              </td>
                            </>
                          )}
                          {selectedTab === "damanganga" && (
                            <>
                              <td className="border border-[#d1d5db] px-4 py-3">
                                <InputNumber
                                  style={{ width: "100%" }}
                                  value={penalty.area}
                                  onChange={(val) => handleAreaChange(penalty.id, val)}
                                  disabled={currentCalculated}
                                  placeholder="0"
                                />
                              </td>
                              <td className="border border-[#d1d5db] px-4 py-3 text-center text-[#334155] font-medium">
                                ₹7
                              </td>
                              <td className="border border-[#d1d5db] px-4 py-3 text-[#334155] font-medium">
                                {currentCalculated ? `₹${feeAmount.toFixed(2)}` : "-"}
                              </td>
                            </>
                          )}
                          {selectedTab === "typewise" && (
                            <>
                              <td className="border border-[#d1d5db] px-4 py-3">
                                <InputNumber
                                  style={{ width: "100%" }}
                                  value={penalty.area}
                                  onChange={(val) => handleAreaChange(penalty.id, val)}
                                  disabled={currentCalculated}
                                  placeholder="0"
                                />
                              </td>
                              <td className="border border-[#d1d5db] px-4 py-3 text-center text-[#334155] font-medium">
                                ₹{rate}
                              </td>
                              <td className="border border-[#d1d5db] px-4 py-3 text-[#334155] font-medium">
                                {currentCalculated ? `₹${feeAmount.toFixed(2)}` : "-"}
                              </td>
                            </>
                          )}
                          <td className="border border-[#d1d5db] px-4 py-3 text-center">
                            <Button
                              danger
                              size="small"
                              onClick={() => handleRemovePenalty(penalty.id)}
                              disabled={currentData.length <= 1 || currentCalculated}
                            >
                              Remove
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Calculate Button */}
              <Button
                type="primary"
                size="large"
                className="w-full bg-[#1e3a8a] hover:bg-[#1e40af] h-12 text-base font-semibold mb-4"
                onClick={calculatePenalties}
                disabled={currentCalculated}
              >
                Calculate
              </Button>

              {/* Summary Section */}
              {currentCalculated && (
                <div className="mt-6 p-4 bg-[#f0f9ff] rounded-lg border-2 border-[#1e3a8a]">
                  <h4 className="text-lg font-bold text-[#1e3a8a] mb-4">
                    Calculation Summary
                  </h4>

                  {selectedTab === "unauthorized" && (
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-white rounded border border-[#e2e8f0]">
                        <span className="font-medium text-[#334155]">
                          Total Penalty:
                        </span>
                        <span className="text-lg font-semibold text-[#1e3a8a]">
                          ₹
                          {currentData
                            .reduce((sum, p) => sum + p.year * p.area * 0.02, 0)
                            .toFixed(2)}
                        </span>
                      </div>

                      <div className="flex justify-between items-center p-3 bg-white rounded border border-[#e2e8f0]">
                        <span className="font-medium text-[#334155]">
                          Total Assessment:
                        </span>
                        <span className="text-lg font-semibold text-[#1e3a8a]">
                          ₹
                          {currentData
                            .reduce((sum, p) => sum + p.year * p.area * 0.02 * 400, 0)
                            .toFixed(2)}
                        </span>
                      </div>

                      <div className="flex justify-between items-center p-3 bg-gradient-to-r from-[#fef3c7] to-[#fef08a] rounded border-2 border-[#d97706]">
                        <span className="font-bold text-[#1f2937] text-lg">
                          Grand Total:
                        </span>
                        <span className="text-2xl font-bold text-[#d97706]">
                          ₹
                          {currentData
                            .reduce(
                              (sum, p) =>
                                sum + (p.year * p.area * 0.02 * 400 + p.year * p.area * 0.02),
                              0
                            )
                            .toFixed(2)}
                        </span>
                      </div>
                    </div>
                  )}

                  {selectedTab === "damanganga" && (
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-white rounded border border-[#e2e8f0]">
                        <span className="font-medium text-[#334155]">
                          Total Area:
                        </span>
                        <span className="text-lg font-semibold text-[#1e3a8a]">
                          {currentData.reduce((sum, p) => sum + p.area, 0)} Sq.Mtrs
                        </span>
                      </div>

                      <div className="flex justify-between items-center p-3 bg-gradient-to-r from-[#fef3c7] to-[#fef08a] rounded border-2 border-[#d97706]">
                        <span className="font-bold text-[#1f2937] text-lg">
                          Total Fees:
                        </span>
                        <span className="text-2xl font-bold text-[#d97706]">
                          ₹
                          {currentData
                            .reduce((sum, p) => sum + p.area * 7, 0)
                            .toFixed(2)}
                        </span>
                      </div>
                    </div>
                  )}

                  {selectedTab === "typewise" && (
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 bg-white rounded border border-[#e2e8f0]">
                        <span className="font-medium text-[#334155]">
                          Total Area:
                        </span>
                        <span className="text-lg font-semibold text-[#1e3a8a]">
                          {currentData.reduce((sum, p) => sum + p.area, 0)} Sq.Mtrs
                        </span>
                      </div>

                      <div className="flex justify-between items-center p-3 bg-white rounded border border-[#e2e8f0]">
                        <span className="font-medium text-[#334155]">
                          Calculated Fees:
                        </span>
                        <span className="text-lg font-semibold text-[#1e3a8a]">
                          ₹
                          {currentData
                            .reduce((sum, p) => sum + p.area * conversionRates[conversionType], 0)
                            .toFixed(2)}
                        </span>
                      </div>

                      <div className="flex justify-between items-center p-3 bg-white rounded border border-[#e2e8f0]">
                        <span className="font-medium text-[#334155]">
                          Minimum Fees:
                        </span>
                        <span className="text-lg font-semibold text-[#1e3a8a]">
                          ₹1000.00
                        </span>
                      </div>

                      <div className="flex justify-between items-center p-3 bg-gradient-to-r from-[#fef3c7] to-[#fef08a] rounded border-2 border-[#d97706]">
                        <span className="font-bold text-[#1f2937] text-lg">
                          Payable Fees:
                        </span>
                        <span className="text-2xl font-bold text-[#d97706]">
                          ₹
                          {Math.max(
                            currentData.reduce((sum, p) => sum + p.area * conversionRates[conversionType], 0),
                            1000
                          ).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Info Section */}
          <div className="mt-8 p-6 bg-white rounded-lg shadow-md border border-[#e2e8f0]">
            <h4 className="text-lg font-bold text-[#1e3a8a] mb-4">
              Calculation Formulas
            </h4>
            <div className="space-y-4 text-sm text-[#334155]">
              {selectedTab === "unauthorized" && (
                <>
                  <div className="p-4 bg-blue-50 rounded border border-blue-200">
                    <p className="font-semibold text-[#1e3a8a] mb-2">
                      Unauthorized Construction Penalty:
                    </p>
                    <ul className="space-y-2 text-sm">
                      <li>
                        <strong>Penalty:</strong> Year × Area × 0.02
                      </li>
                      <li>
                        <strong>Assessment:</strong> Penalty × 400
                      </li>
                      <li>
                        <strong>Total:</strong> Penalty + Assessment
                      </li>
                    </ul>
                  </div>
                </>
              )}
              {selectedTab === "damanganga" && (
                <>
                  <div className="p-4 bg-green-50 rounded border border-green-200">
                    <p className="font-semibold text-[#065f46] mb-2">
                      Damanganga Irrigation Fees:
                    </p>
                    <ul className="space-y-2 text-sm">
                      <li>
                        <strong>Rate:</strong> ₹7 per sq.m
                      </li>
                      <li>
                        <strong>Total Fees:</strong> Area × ₹7
                      </li>
                    </ul>
                  </div>
                </>
              )}
              {selectedTab === "typewise" && (
                <>
                  <div className="p-4 bg-amber-50 rounded border border-amber-200">
                    <p className="font-semibold text-[#d97706] mb-2">
                      Conversion Fees:
                    </p>
                    <ul className="space-y-2 text-sm">
                      <li>
                        <strong>Calculated Fees:</strong> Area × Type-based Rate
                      </li>
                      <li>
                        <strong>Minimum Fees:</strong> ₹1000
                      </li>
                      <li>
                        <strong>Payable Fees:</strong> Max(Calculated Fees, ₹1000)
                      </li>
                    </ul>
                  </div>
                  <div className="p-4 bg-gray-50 rounded border border-gray-200">
                    <p className="font-semibold text-[#334155] mb-2">
                      Conversion Type Rates:
                    </p>
                    <ul className="space-y-1 text-sm">
                      {Object.entries(conversionRates).map(([type, rate]) => (
                        <li key={type}>
                          {type.charAt(0).toUpperCase() + type.slice(1)}: ₹{rate}/sq.m
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              )}
              <p className="text-[#64748b] mt-4 pt-4 border-t border-[#e2e8f0]">
                Note: These calculations are based on the standard government rates.
                Actual amounts may vary based on specific circumstances and official
                assessment.
              </p>
            </div>
          </div>

          {/* Navigation */}
          <div className="mt-8 flex justify-between">
            <Link href="/">
              <Button type="default" size="large" className="h-11 text-base">
                Back to Home
              </Button>
            </Link>
            <Link href="/faq">
              <Button type="primary" size="large" className="bg-[#1e3a8a] h-11 text-base">
                FAQ & Help
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
