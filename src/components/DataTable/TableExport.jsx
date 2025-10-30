import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';

/**
 * TableExport Component - Export data to CSV
 *
 * @param {Object} props
 * @param {Array} props.data - Data to export
 * @param {Array} props.columns - Column definitions
 * @param {String} props.filename - Export filename (without extension)
 */
export const TableExport = ({
  data = [],
  columns = [],
  filename = 'export'
}) => {
  const handleExport = () => {
    if (data.length === 0) {
      alert('No data to export');
      return;
    }

    // Create CSV headers
    const headers = columns.map(col => col.label).join(',');

    // Create CSV rows
    const rows = data.map(row => {
      return columns.map(col => {
        let value = row[col.key];

        // Handle null/undefined
        if (value === null || value === undefined) {
          return '';
        }

        // Convert to string
        value = String(value);

        // Escape quotes and wrap in quotes if contains comma, quote, or newline
        if (value.includes(',') || value.includes('"') || value.includes('\n')) {
          value = `"${value.replace(/"/g, '""')}"`;
        }

        return value;
      }).join(',');
    });

    // Combine headers and rows
    const csv = [headers, ...rows].join('\n');

    // Create blob and download
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <button
      onClick={handleExport}
      disabled={data.length === 0}
      className="inline-flex items-center gap-2 px-4 py-2 bg-bg-secondary border border-border rounded-lg text-text-primary font-body font-medium hover:bg-bg-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      title="Export to CSV"
    >
      <ArrowDownTrayIcon className="w-5 h-5" />
      Export
    </button>
  );
};
