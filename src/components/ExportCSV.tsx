import { Download } from 'lucide-react';

interface ExportCSVProps<T> {
  data: T[];
  filename: string;
  headers?: { key: keyof T; label: string }[];
  className?: string;
}

export function ExportCSV<T extends Record<string, any>>({
  data,
  filename,
  headers,
  className = '',
}: ExportCSVProps<T>) {
  const exportToCSV = () => {
    if (data.length === 0) return;

    // Use provided headers or auto-detect from first item
    const cols = headers || Object.keys(data[0]).map(key => ({
      key: key as keyof T,
      label: key as string,
    }));

    // Create header row
    const headerRow = cols.map(col => col.label).join(',');

    // Create data rows
    const rows = data.map(item =>
      cols.map(col => {
        const value = item[col.key];
        // Handle values that need quoting
        if (value === null || value === undefined) return '';
        const str = String(value);
        if (str.includes(',') || str.includes('"') || str.includes('\n')) {
          return `"${str.replace(/"/g, '""')}"`;
        }
        return str;
      }).join(',')
    );

    // Combine and create blob
    const csv = [headerRow, ...rows].join('\n');
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    // Download
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (data.length === 0) return null;

  return (
    <button
      onClick={exportToCSV}
      className={`flex items-center gap-2 px-4 py-2.5 bg-marine-800/50 border border-marine-700 rounded-xl text-sm text-marine-400 hover:text-white hover:bg-marine-700/50 transition-colors ${className}`}
    >
      <Download className="h-4 w-4" />
      Exportar CSV
    </button>
  );
}
