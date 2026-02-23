'use client';

import { useState } from 'react';
import { useRunwayStore } from '@/lib/stores/runwayStore';
import { downloadCSV, downloadJSON } from '@/lib/storage/localStorage';
import { Download, FileText, FileJson, CheckCircle, AlertCircle } from 'lucide-react';
import { InfoTooltip } from '@/components/ui/InfoTooltip';

export default function DataExport() {
  const { data } = useRunwayStore();
  const [exportStatus, setExportStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({ type: null, message: '' });

  const handleExportCSV = () => {
    if (!data) {
      setExportStatus({
        type: 'error',
        message: 'No data to export. Please add some financial data first.'
      });
      return;
    }

    try {
      downloadCSV(data);
      setExportStatus({
        type: 'success',
        message: 'CSV file downloaded successfully!'
      });
      setTimeout(() => setExportStatus({ type: null, message: '' }), 3000);
    } catch (error) {
      console.error('❌ CSV export failed:', error);
      setExportStatus({
        type: 'error',
        message: `Export failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    }
  };

  const handleExportJSON = () => {
    if (!data) {
      setExportStatus({
        type: 'error',
        message: 'No data to export. Please add some financial data first.'
      });
      return;
    }

    try {
      downloadJSON(data);
      setExportStatus({
        type: 'success',
        message: 'JSON file downloaded successfully!'
      });
      setTimeout(() => setExportStatus({ type: null, message: '' }), 3000);
    } catch (error) {
      console.error('❌ JSON export failed:', error);
      setExportStatus({
        type: 'error',
        message: `Export failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      });
    }
  };

  return (
    <div className="bg-bg-secondary rounded-lg border border-border p-6 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-text-primary flex items-center gap-2">
            <Download className="w-5 h-5" />
            Export Your Data
            <InfoTooltip content="Download your financial data for backup or use in other applications" />
          </h3>
          <p className="text-sm text-text-secondary mt-1">
            Your data is stored locally on this device. Export regularly to prevent data loss.
          </p>
        </div>
      </div>

      {/* Export Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {/* CSV Export */}
        <button
          onClick={handleExportCSV}
          disabled={!data}
          className={`
            flex items-center justify-center gap-3 px-4 py-3 rounded-lg font-medium transition-all
            ${data
              ? 'bg-primary hover:bg-primary-hover text-white shadow-sm hover:shadow-md'
              : 'bg-bg-tertiary text-text-tertiary cursor-not-allowed'
            }
          `}
        >
          <FileText className="w-5 h-5" />
          <div className="text-left">
            <div className="font-semibold">Export CSV</div>
            <div className="text-xs opacity-90">Excel-compatible format</div>
          </div>
        </button>

        {/* JSON Export */}
        <button
          onClick={handleExportJSON}
          disabled={!data}
          className={`
            flex items-center justify-center gap-3 px-4 py-3 rounded-lg font-medium transition-all
            ${data
              ? 'bg-secondary hover:bg-secondary-hover text-white shadow-sm hover:shadow-md'
              : 'bg-bg-tertiary text-text-tertiary cursor-not-allowed'
            }
          `}
        >
          <FileJson className="w-5 h-5" />
          <div className="text-left">
            <div className="font-semibold">Export JSON</div>
            <div className="text-xs opacity-90">Full data backup</div>
          </div>
        </button>
      </div>

      {/* Status Message */}
      {exportStatus.type && (
        <div
          className={`
            flex items-center gap-2 p-3 rounded-lg text-sm font-medium
            ${exportStatus.type === 'success'
              ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-800'
              : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-800'
            }
          `}
        >
          {exportStatus.type === 'success' ? (
            <CheckCircle className="w-4 h-4" />
          ) : (
            <AlertCircle className="w-4 h-4" />
          )}
          {exportStatus.message}
        </div>
      )}

      {/* Warning Notice */}
      <div className="flex items-start gap-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
        <AlertCircle className="w-4 h-4 text-yellow-600 dark:text-yellow-400 mt-0.5 flex-shrink-0" />
        <div className="text-xs text-yellow-800 dark:text-yellow-200">
          <strong>Important:</strong> Your data lives only on this device's browser storage.
          If you clear your browser data or use a different device, your data will be lost.
          Export regularly to keep backups!
        </div>
      </div>

      {/* Data Info */}
      {data && (
        <div className="text-xs text-text-tertiary space-y-1 pt-2 border-t border-border">
          <div>Scenarios: {data.scenarios.length}</div>
          <div>Last updated: {new Date(data.updatedAt).toLocaleString()}</div>
          <div>Version: {data.version}</div>
        </div>
      )}
    </div>
  );
}
