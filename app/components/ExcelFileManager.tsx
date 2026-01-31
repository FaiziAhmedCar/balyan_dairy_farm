"use client";

import { useRef, useState } from "react";

interface ExcelFileManagerProps {
  onDownloadExcel: () => void;
  onUploadExcel: (file: File) => Promise<boolean>;
  fileInfo?: {
    fileName: string;
    sheetName: string;
    totalRecords: number;
    lastUpdated: number | null;
  };
}

export default function ExcelFileManager({
  onDownloadExcel,
  onUploadExcel,
  fileInfo,
}: ExcelFileManagerProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check if it's an Excel file
    if (!file.name.endsWith(".xlsx") && !file.name.endsWith(".xls")) {
      alert("Please select an Excel file (.xlsx or .xls)");
      return;
    }

    setUploading(true);
    setUploadStatus("idle");

    try {
      const success = await onUploadExcel(file);
      if (success) {
        setUploadStatus("success");
        setTimeout(() => setUploadStatus("idle"), 3000);
      } else {
        setUploadStatus("error");
      }
    } catch (error) {
      console.error("Upload failed:", error);
      setUploadStatus("error");
    } finally {
      setUploading(false);
      // Clear the file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const formatDate = (timestamp: number | null) => {
    if (!timestamp) return "Never";
    return new Date(timestamp).toLocaleString();
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Excel File Management
      </h3>

      {/* File Info */}
      {fileInfo && (
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-gray-600">File Name:</span>
              <span className="ml-2 text-gray-900">{fileInfo.fileName}</span>
            </div>
            <div>
              <span className="font-medium text-gray-600">Sheet Name:</span>
              <span className="ml-2 text-gray-900">{fileInfo.sheetName}</span>
            </div>
            <div>
              <span className="font-medium text-gray-600">Total Records:</span>
              <span className="ml-2 text-gray-900">
                {fileInfo.totalRecords}
              </span>
            </div>
            <div>
              <span className="font-medium text-gray-600">Last Updated:</span>
              <span className="ml-2 text-gray-900">
                {formatDate(fileInfo.lastUpdated)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Download Excel */}
        <button
          onClick={onDownloadExcel}
          className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          Download Excel File
        </button>

        {/* Upload Excel */}
        <div className="flex-1 relative">
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls"
            onChange={handleFileSelect}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            disabled={uploading}
          />
          <button
            disabled={uploading}
            className={`w-full px-4 py-2 rounded-lg font-medium flex items-center justify-center transition-colors ${
              uploading
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {uploading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Uploading...
              </>
            ) : (
              <>
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                Upload Excel File
              </>
            )}
          </button>
        </div>
      </div>

      {/* Upload Status */}
      {uploadStatus === "success" && (
        <div className="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg">
          ✓ Excel file uploaded successfully!
        </div>
      )}

      {uploadStatus === "error" && (
        <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          ✗ Failed to upload Excel file. Please check the file format and try
          again.
        </div>
      )}

      {/* Instructions */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-medium text-blue-900 mb-2">
          Excel File Instructions:
        </h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Download the current Excel file to see the required format</li>
          <li>
            • The Excel file must contain a sheet named &quot;Expenses&quot;
          </li>
          <li>
            • Required columns: ID, Date, Category, Description, Amount,
            PaymentMethod
          </li>
          <li>• Optional columns: Quantity, Unit, Supplier, Notes</li>
          <li>
            • Upload will replace all existing data with the Excel file contents
          </li>
        </ul>
      </div>
    </div>
  );
}
