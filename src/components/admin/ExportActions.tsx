import React, { useRef } from 'react';
import { ChevronDown, Download, FileSpreadsheet, FileText } from 'lucide-react';
import { ExportFormat } from '../../utils/export';

interface ExportActionsProps {
  onExport: (format: ExportFormat) => void | Promise<void>;
  label: string;
}

const formats: Array<{ format: ExportFormat; label: string; Icon: typeof Download }> = [
  { format: 'csv', label: 'CSV', Icon: Download },
  { format: 'excel', label: 'Excel', Icon: FileSpreadsheet },
  { format: 'pdf', label: 'PDF', Icon: FileText },
];

export const ExportActions: React.FC<ExportActionsProps> = ({ onExport, label }) => {
  const dropdownRef = useRef<HTMLDetailsElement>(null);

  const handleExport = (format: ExportFormat) => {
    if (dropdownRef.current) dropdownRef.current.open = false;
    void onExport(format);
  };

  return (
    <details ref={dropdownRef} className="relative">
      <summary className="flex cursor-pointer list-none items-center gap-2 rounded-xl border border-[#C5A15B] bg-white px-3.5 py-2 text-xs font-semibold text-[#173D32] shadow-sm transition-colors hover:bg-[#FAF6EE] [&::-webkit-details-marker]:hidden">
        <Download className="h-3.5 w-3.5 text-[#C5A15B]" />
        <span>{label}</span>
        <ChevronDown className="h-3.5 w-3.5 text-[#997838]" />
      </summary>

      <div className="absolute right-0 z-30 mt-2 min-w-44 overflow-hidden rounded-xl border border-[#C5A15B]/40 bg-white p-1.5 shadow-xl">
        {formats.map(({ format, label: formatLabel, Icon }) => (
          <button
            key={format}
            type="button"
            onClick={() => handleExport(format)}
            className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-xs font-medium text-[#173D32] transition-colors hover:bg-[#FAF6EE]"
          >
            <Icon className="h-4 w-4 text-[#997838]" />
            <span>{formatLabel}</span>
          </button>
        ))}
      </div>
    </details>
  );
};
