import { Upload, FileText, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useRef, useState } from 'react';

interface CsvImportProps {
  entityLabel: string;
  requiredFields: string[];
  onImport: (rows: Record<string, string>[]) => Promise<void>;
}

function parseCsv(text: string): { headers: string[]; rows: Record<string, string>[] } {
  const lines = text.split(/\r?\n/).filter((l) => l.trim());
  if (lines.length === 0) return { headers: [], rows: [] };

  const firstLine = lines[0];
  if (!firstLine) return { headers: [], rows: [] };
  const headers = firstLine.split(',').map((h) => h.trim().replace(/^"|"$/g, ''));
  const rows = lines.slice(1).map((line) => {
    const values: string[] = [];
    let current = '';
    let inQuotes = false;
    for (const char of line) {
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current.trim());
    const row: Record<string, string> = {};
    headers.forEach((h, i) => {
      row[h] = values[i] || '';
    });
    return row;
  });

  return { headers, rows };
}

export function CsvImport({ entityLabel, requiredFields, onImport }: CsvImportProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<{
    headers: string[];
    rows: Record<string, string>[];
  } | null>(null);
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setResult(null);

    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      const parsed = parseCsv(text);
      setPreview(parsed);
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleImport = async () => {
    if (!preview) return;
    setImporting(true);
    setResult(null);
    try {
      await onImport(preview.rows);
      setResult({
        success: true,
        message: `Successfully imported ${preview.rows.length} ${entityLabel}.`,
      });
      setPreview(null);
    } catch (err: unknown) {
      setResult({ success: false, message: err instanceof Error ? err.message : 'Import failed.' });
    } finally {
      setImporting(false);
    }
  };

  const missingFields = preview ? requiredFields.filter((f) => !preview.headers.includes(f)) : [];

  return (
    <div className="space-y-3">
      <input ref={inputRef} type="file" accept=".csv" onChange={handleFile} className="hidden" />
      <button
        onClick={() => inputRef.current?.click()}
        disabled={importing}
        className="cursor-pointer bg-white hover:bg-cream border border-stone text-ink px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-widest flex items-center gap-2 transition-colors disabled:opacity-50"
      >
        <Upload className="h-3.5 w-3.5" />
        Import CSV
      </button>

      {result && (
        <div
          className={`p-3 rounded-xl text-xs font-mono flex items-center gap-2 ${
            result.success
              ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
              : 'bg-red-50 border border-red-200 text-red-800'
          }`}
        >
          {result.success ? (
            <CheckCircle2 className="h-4 w-4 shrink-0" />
          ) : (
            <AlertTriangle className="h-4 w-4 shrink-0" />
          )}
          {result.message}
        </div>
      )}

      {preview && (
        <div className="bg-white border border-stone rounded-xl p-4 space-y-3">
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-clay" />
            <span className="font-mono text-xs font-bold text-ink">
              Preview: {preview.rows.length} rows, {preview.headers.length} columns
            </span>
          </div>

          {missingFields.length > 0 && (
            <div className="p-2 bg-amber-50 border border-amber-200 rounded-lg text-[10px] font-mono text-amber-800">
              Missing required fields: {missingFields.join(', ')}
            </div>
          )}

          <div className="overflow-x-auto max-h-40">
            <table className="w-full text-[10px] font-mono border-collapse">
              <thead>
                <tr className="bg-cream">
                  {preview.headers.map((h) => (
                    <th key={h} className="p-1.5 text-left font-bold text-clay border border-stone">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {preview.rows.slice(0, 5).map((row, i) => (
                  <tr key={i}>
                    {preview.headers.map((h) => (
                      <td key={h} className="p-1.5 border border-stone text-ink">
                        {row[h]}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {preview.rows.length > 5 && (
            <span className="text-[10px] font-mono text-clay">
              ...and {preview.rows.length - 5} more rows
            </span>
          )}

          <div className="flex gap-2">
            <button
              onClick={handleImport}
              disabled={importing || missingFields.length > 0}
              className="cursor-pointer bg-ink hover:bg-shadow text-white px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-widest disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {importing ? 'Importing...' : `Import ${preview.rows.length} Rows`}
            </button>
            <button
              onClick={() => setPreview(null)}
              className="cursor-pointer bg-white border border-stone text-clay px-4 py-2 rounded-xl text-xs font-mono font-bold uppercase tracking-widest hover:text-ink"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
