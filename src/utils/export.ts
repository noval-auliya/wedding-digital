export type ExportFormat = 'csv' | 'excel' | 'pdf';
export type ExportCell = string | number | boolean | null | undefined;

export const exportRecords = async (
  format: ExportFormat,
  filename: string,
  title: string,
  headers: string[],
  rows: ExportCell[][],
): Promise<void> => {
  if (format === 'csv') {
    const escapeCsvCell = (value: ExportCell) =>
      `"${String(value ?? '').replace(/"/g, '""')}"`;
    const csv = [headers, ...rows]
      .map((row) => row.map(escapeCsvCell).join(','))
      .join('\r\n');
    const blob = new Blob(['\uFEFF', csv], { type: 'text/csv;charset=utf-8' });
    downloadBlob(blob, `${filename}.csv`);
    return;
  }

  if (format === 'excel') {
    const { default: writeXlsxFile } = await import('write-excel-file/browser');
    const data = [headers, ...rows].map((row) => row.map((value) => value ?? null));
    const blob = await writeXlsxFile(data).toBlob();
    downloadBlob(blob, `${filename}.xlsx`);
    return;
  }

  const [{ default: jsPDF }, { default: autoTable }] = await Promise.all([
    import('jspdf'),
    import('jspdf-autotable'),
  ]);
  const pdf = new jsPDF({
    orientation: headers.length > 5 ? 'landscape' : 'portrait',
    unit: 'mm',
    format: 'a4',
  });
  pdf.setFontSize(14);
  pdf.text(title, 14, 15);
  autoTable(pdf, {
    head: [headers],
    body: rows.map((row) => row.map((value) => String(value ?? ''))),
    startY: 22,
    styles: { fontSize: 8, cellPadding: 2, overflow: 'linebreak' },
    headStyles: { fillColor: [23, 61, 50] },
    margin: { left: 14, right: 14 },
  });
  pdf.save(`${filename}.pdf`);
};

const downloadBlob = (blob: Blob, filename: string): void => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
};
