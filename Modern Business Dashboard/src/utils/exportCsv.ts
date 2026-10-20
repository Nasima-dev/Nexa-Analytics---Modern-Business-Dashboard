/**
 * Exports data rows to a browser-downloaded CSV file
 */
export function exportToCSV<T extends object>(
  filename: string,
  rows: T[],
  customHeaders?: Partial<Record<keyof T, string>>
) {
  if (!rows || !rows.length) {
    throw new Error('No data available to export');
  }

  const keys = Object.keys(rows[0]) as (keyof T)[];
  const headerLabels = keys.map((key) => {
    if (customHeaders && customHeaders[key]) {
      return `"${String(customHeaders[key]).replace(/"/g, '""')}"`;
    }
    return `"${String(key).replace(/"/g, '""')}"`;
  });

  const csvContentLines = rows.map((row) =>
    keys
      .map((key) => {
        const val = (row as Record<string, unknown>)[key as string];
        if (val === null || val === undefined) return '""';
        const stringVal = String(val).replace(/"/g, '""');
        return `"${stringVal}"`;
      })
      .join(',')
  );

  const csvString = [headerLabels.join(','), ...csvContentLines].join('\r\n');
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
