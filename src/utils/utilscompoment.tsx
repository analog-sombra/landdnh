"use client";

export const queryStatus = (status: string) => {
  switch (status) {
    case "QUERY":
      return (
        <p className="text-xs px-4 py-1 bg-emerald-500/10 border border-emerald-500 rounded-md text-emerald-500">
          Query
        </p>
      );
    case "CORESPONDENCE":
      return (
        <p className="text-xs px-4 py-1 bg-blue-500/10 border border-blue-500 rounded-md text-blue-500">
          Correspondence
        </p>
      );
    case "NOTING":
      return (
        <p className="text-xs px-4 py-1 bg-yellow-500/10 border border-yellow-500 rounded-md text-yellow-500">
          Noting
        </p>
      );
    case "UPDATES":
      return (
        <p className="text-xs px-4 py-1 bg-cyan-500/10 border border-cyan-500 rounded-md text-cyan-500">
          Updates
        </p>
      );
    case "REPORT":
      return (
        <p className="text-xs px-4 py-1 bg-purple-500/10 border border-purple-500 rounded-md text-purple-500">
          Report
        </p>
      );
    case "SUBMITREPORT":
      return (
        <p className="text-xs px-4 py-1 bg-pink-500/10 border border-pink-500 rounded-md text-pink-500">
          Report Received
        </p>
      );
    case "SUBMITREPORTEDITOR":
      return (
        <p className="text-xs px-4 py-1 bg-indigo-500/10 border border-indigo-500 rounded-md text-indigo-500">
          Submit Report Editor
        </p>
      );
    case "PRENOTE":
      return (
        <p className="text-xs px-4 py-1 bg-orange-500/10 border border-orange-500 rounded-md text-orange-500">
          PreNote
        </p>
      );
    case "HEARING_SCHEDULED":
      return (
        <p className="text-xs px-4 py-1 bg-teal-500/10 border border-teal-500 rounded-md text-teal-500">
          Hearing Scheduled
        </p>
      );
    case "RESCHEDULED":
      return (
        <p className="text-xs px-4 py-1 bg-lime-500/10 border border-lime-500 rounded-md text-lime-500">
          Rescheduled
        </p>
      );
    case "JIMNI":
      return (
        <p className="text-xs px-4 py-1 bg-red-500/10 border border-red-500 rounded-md text-red-500">
          Jimni
        </p>
      );
    case "SANAD":
      return (
        <p className="text-xs px-4 py-1 bg-gray-500/10 border border-gray-500 rounded-md text-gray-500">
          Sanad
        </p>
      );
    default:
      return (
        <p className="text-xs px-4 py-1 bg-rose-500/10 border border-rose-500 rounded-md text-rose-500">
          {status}
        </p>
      );
  }
};
