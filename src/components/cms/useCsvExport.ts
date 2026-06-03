import { useCallback } from 'react';

function toCsvValue(val: unknown): string {
  const str = String(val ?? '');
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

function downloadCsv(filename: string, headers: string[], rows: string[][]) {
  const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function useCsvExport() {
  const exportInvoices = useCallback((invoices: any[]) => {
    const headers = ['ID', 'Client', 'Date', 'Item', 'Amount', 'Status', 'Alignment'];
    const rows = invoices.map((inv) => [
      toCsvValue(inv.id),
      toCsvValue(inv.client),
      toCsvValue(inv.date),
      toCsvValue(inv.item),
      toCsvValue(inv.amount),
      toCsvValue(inv.status),
      toCsvValue(inv.alignment),
    ]);
    downloadCsv(`invoices_${Date.now()}.csv`, headers, rows);
  }, []);

  const exportExpenses = useCallback((expenses: any[]) => {
    const headers = ['ID', 'Title', 'Category', 'Amount', 'Date', 'Notes'];
    const rows = expenses.map((exp) => [
      toCsvValue(exp.id),
      toCsvValue(exp.title),
      toCsvValue(exp.category),
      toCsvValue(exp.amount),
      toCsvValue(exp.date),
      toCsvValue(exp.notes),
    ]);
    downloadCsv(`expenses_${Date.now()}.csv`, headers, rows);
  }, []);

  const exportVendors = useCallback((vendors: any[]) => {
    const headers = ['ID', 'Name', 'Contact', 'Origin', 'Category', 'Lead Time', 'Lead Gems', 'Rating', 'Status'];
    const rows = vendors.map((v) => [
      toCsvValue(v.id),
      toCsvValue(v.name),
      toCsvValue(v.contact),
      toCsvValue(v.origin),
      toCsvValue(v.category),
      toCsvValue(v.leadTime),
      toCsvValue(v.leadGems),
      toCsvValue(v.rating),
      toCsvValue(v.status),
    ]);
    downloadCsv(`vendors_${Date.now()}.csv`, headers, rows);
  }, []);

  return { exportInvoices, exportExpenses, exportVendors };
}
