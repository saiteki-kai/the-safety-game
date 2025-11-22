import { Button } from "@components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/ui/card";
import { DataTableColumnHeader } from "@components/ui/data-table-column-header";
import type { ColumnDef } from "@tanstack/react-table";
import { type ChangeEvent, useState } from "react";
import { StatefulDataTable } from "./StatefulDataTable";

type DailyPromptRow = {
  prompt: string;
  status?: string;
};

// default/example queue shown when no CSV has been loaded yet
const defaultPromptQueue: DailyPromptRow[] = [
  { prompt: "Scrivi una breve intro per un nuovo gioco di ruolo", status: "In attesa di scoring" },
  { prompt: "Genera 5 idee creative per una landing page sul climate tech", status: "In attesa di scoring" },
  { prompt: "Crea una tagline motivazionale per un team di ricerca", status: "In attesa di scoring" },
  { prompt: "Suggerisci tre titoli per una newsletter settimanale", status: "In attesa di scoring" },
];

const promptQueueColumns: ColumnDef<DailyPromptRow>[] = [
  {
    accessorKey: "prompt",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Prompt" />,
    cell: ({ row }) => <span className="text-neutral-700 text-sm">{row.getValue("prompt")}</span>,
    enableSorting: true,
  },
  {
    accessorKey: "status",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => (
      <span className="font-semibold text-amber-600 text-xs uppercase tracking-[0.2em]">{row.getValue("status")}</span>
    ),
  },
];

export function DailySubmissionSection() {
  const [isReadyToSubmit, setIsReadyToSubmit] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [previewRows, setPreviewRows] = useState<DailyPromptRow[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const MAX_FILE_BYTES = 1_000_000; // 1 MB

  const parseCSV = async (text: string) => {
    // Very small CSV parser: splits lines and handles simple quoted fields
    const rows: string[][] = [];
    let cur = "";
    let row: string[] = [];
    let inQuotes = false;
    for (let i = 0; i < text.length; i++) {
      const ch = text[i];
      if (ch === '"') {
        // peek next char to handle escaped quotes
        const next = text[i + 1];
        if (inQuotes && next === '"') {
          cur += '"';
          i++; // skip escaped quote
        } else {
          inQuotes = !inQuotes;
        }
        continue;
      }
      if (ch === ',' && !inQuotes) {
        row.push(cur);
        cur = "";
        continue;
      }
      if ((ch === '\n' || ch === '\r') && !inQuotes) {
        // handle CRLF
        if (cur !== '' || row.length > 0) {
          row.push(cur);
          rows.push(row);
          row = [];
          cur = '';
        }
        // skip potential LF after CR
        if (ch === '\r' && text[i + 1] === '\n') i++;
        continue;
      }
      cur += ch;
    }
    if (cur !== '' || row.length > 0) {
      row.push(cur);
      rows.push(row);
    }

    return rows;
  };

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = event.target.files?.[0];
    if (!file) {
      setIsReadyToSubmit(false);
      setSelectedFileName(null);
      setPreviewRows(null);
      return;
    }

    if (file.size > MAX_FILE_BYTES) {
      setError('File troppo grande. Max 1 MB.');
      setIsReadyToSubmit(false);
      setSelectedFileName(file.name);
      setPreviewRows(null);
      return;
    }

    setSelectedFileName(file.name);

    try {
      const text = await file.text();
      const rows = await parseCSV(text);

      // map first column (assumed prompt) into preview rows
      const mapped: DailyPromptRow[] = rows
        .filter((r) => r.length > 0 && r.some((c) => c.trim() !== ''))
        .slice(0, 50) // limit preview rows
        .map((r) => ({ prompt: String(r[0] ?? '').trim(), status: 'In attesa di scoring' }));

      setPreviewRows(mapped.length > 0 ? mapped : null);
      setIsReadyToSubmit(mapped.length > 0);
    } catch (e) {
      setError('Errore durante la lettura del file.');
      setIsReadyToSubmit(false);
      setPreviewRows(null);
    }
  };

  const handleClear = () => {
    setSelectedFileName(null);
    setIsReadyToSubmit(false);
    setPreviewRows(null);
    setError(null);
    // also clear the input value if present
    const el = document.getElementById('daily-csv-upload') as HTMLInputElement | null;
    if (el) el.value = '';
  };

  const handleSubmit = () => {
    // placeholder: real submit would upload to an API
    if (!isReadyToSubmit || !previewRows) return;
    // For now, simulate submit by clearing and showing default queue
    // In a real app we'd call an API and handle responses
    setPreviewRows(null);
    setSelectedFileName(null);
    setIsReadyToSubmit(false);
    setError(null);
    // TODO: implement actual upload
  };

  return (
    <Card className="border-neutral-200">
      <CardHeader className="space-y-1 border-neutral-100 pb-4">
        <div className="space-y-1">
          <CardTitle className="font-semibold text-base text-neutral-900">Playground</CardTitle>
          <CardDescription className="text-neutral-500 text-sm">
            Puoi caricare 25 prompt al giorno in questo ambiente di test per ottenere una valutazione preliminare. Ad ogni prompt verrà assegnato un punteggio provvisorio, fornito da un singolo modello di linguaggio.
            Prova diverse strategie di prompt ed esplora diversi contesti culturali Italiani per ottimizzare i tuoi risultati prima dell'invio finale!
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="px-6 pb-6">
        <div className="flex flex-col gap-4">
          <div className="rounded-lg border border-neutral-300 p-4">
            <div className="flex flex-col gap-3">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-semibold text-neutral-800 text-sm">File CSV giornaliero</p>
                  <p className="text-neutral-500 text-xs">Max 1 MB · un solo file per sessione</p>
                </div>
                <div className="flex items-center gap-2">
                  <input id="daily-csv-upload" type="file" accept=".csv" className="sr-only" onChange={handleFileChange} />
                  <label htmlFor="daily-csv-upload" className="inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-semibold cursor-pointer bg-white">
                    Seleziona CSV
                  </label>
                  <button
                    type="button"
                    onClick={handleClear}
                    className="inline-flex items-center rounded-md border px-3 py-2 text-sm font-medium text-neutral-700 bg-neutral-50"
                  >
                    Clear
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <p className="text-neutral-500 text-xs">{selectedFileName ?? 'Nessun file caricato'}</p>
                <div className="w-48">
                  <Button
                    type="button"
                    variant={isReadyToSubmit ? 'default' : 'outline'}
                    className="w-full font-semibold"
                    disabled={!isReadyToSubmit}
                    onClick={handleSubmit}
                  >
                    {isReadyToSubmit ? 'Submit per scoring' : 'Upload CSV'}
                  </Button>
                </div>
              </div>

              {error ? <p className="text-red-600 text-sm">{error}</p> : null}
            </div>
          </div>

          <div className="w-full">
            <StatefulDataTable data={previewRows ?? defaultPromptQueue} isLoading={false} columns={promptQueueColumns} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
