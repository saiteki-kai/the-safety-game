import { actions } from "astro:actions";
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

interface DailySubmissionSectionProps {
  teamId: string;
}

export function DailySubmissionSection({ teamId }: DailySubmissionSectionProps) {
  const [isReadyToSubmit, setIsReadyToSubmit] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [previewRows, setPreviewRows] = useState<DailyPromptRow[] | null>(null);
  const [submissions, setSubmissions] = useState<DailyPromptRow[]>([]);
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
      if (ch === "," && !inQuotes) {
        row.push(cur);
        cur = "";
        continue;
      }
      if ((ch === "\n" || ch === "\r") && !inQuotes) {
        // handle CRLF
        if (cur !== "" || row.length > 0) {
          row.push(cur);
          rows.push(row);
          row = [];
          cur = "";
        }
        // skip potential LF after CR
        if (ch === "\r" && text[i + 1] === "\n") i++;
        continue;
      }
      cur += ch;
    }
    if (cur !== "" || row.length > 0) {
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
      setError("File troppo grande. Max 1 MB.");
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
        .filter((r) => r.length > 0 && r.some((c) => c.trim() !== ""))
        .slice(0, 50) // limit preview rows
        .map((r) => ({ prompt: String(r[0] ?? "").trim(), status: "In attesa di scoring" }));
      setPreviewRows(mapped.length > 0 ? mapped : null);
      setSubmissions(mapped.length > 0 ? mapped : []);
      setIsReadyToSubmit(mapped.length > 0);
    } catch (e) {
      setError("Errore durante la lettura del file.");
      setIsReadyToSubmit(false);
      setPreviewRows(null);
    }
  };

  const handleClear = () => {
    setSelectedFileName(null);
    setIsReadyToSubmit(false);
    setPreviewRows(null);
    setSubmissions([]);
    setError(null);
    // also clear the input value if present
    const el = document.getElementById("daily-csv-upload") as HTMLInputElement | null;
    if (el) el.value = "";
  };

  const handleSubmit = async () => {
    if (!isReadyToSubmit || submissions.length === 0) return;

    setIsReadyToSubmit(false);

    try {
      const result = await actions.submissions.uploadDailyPrompts({
        teamId,
        prompts: submissions.map((r) => r.prompt),
      });
      // Only update when result contains a non-null array in data.data
      const returned = result?.data?.data ?? null;
      if (returned && Array.isArray(returned)) {
        const updated: DailyPromptRow[] = returned.map((s: any) => ({ prompt: s.prompt, status: s.response }));
        setSubmissions(updated);
        setPreviewRows(updated);
        setSelectedFileName(null);
      } else {
        setError("Nessuna risposta dal server.");
      }
    } catch (e) {
      setError("Errore durante l'upload dei prompt.");
      setIsReadyToSubmit(false);
    }
  };

  return (
    <Card className="border-neutral-200">
      <CardHeader className="space-y-1 border-neutral-100 pb-4">
        <div className="space-y-1">
          <CardTitle className="font-semibold text-base text-neutral-900">Playground</CardTitle>
          <CardDescription className="text-neutral-500 text-sm">
            Puoi caricare 25 prompt al giorno in questo ambiente di test per ottenere una valutazione preliminare. Ad
            ogni prompt verrà assegnato un punteggio provvisorio, fornito da un singolo modello di linguaggio. Prova
            diverse strategie di prompt ed esplora diversi contesti culturali Italiani per ottimizzare i tuoi risultati
            prima dell'invio finale!
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
                  <input
                    id="daily-csv-upload"
                    type="file"
                    accept=".csv"
                    className="sr-only"
                    onChange={handleFileChange}
                  />
                  <label
                    htmlFor="daily-csv-upload"
                    className="inline-flex cursor-pointer items-center gap-2 rounded-md border bg-white px-3 py-2 font-semibold text-sm"
                  >
                    Seleziona CSV
                  </label>
                  <button
                    type="button"
                    onClick={handleClear}
                    className="inline-flex items-center rounded-md border bg-neutral-50 px-3 py-2 font-medium text-neutral-700 text-sm"
                  >
                    Clear
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <p className="text-neutral-500 text-xs">{selectedFileName ?? "Nessun file caricato"}</p>
                <div className="w-48">
                  <Button
                    type="button"
                    variant={isReadyToSubmit ? "default" : "outline"}
                    className="w-full font-semibold"
                    disabled={!isReadyToSubmit}
                    onClick={handleSubmit}
                  >
                    {isReadyToSubmit ? "Submit per scoring" : "Upload CSV"}
                  </Button>
                </div>
              </div>

              {error ? <p className="text-red-600 text-sm">{error}</p> : null}
            </div>
          </div>

          <div className="w-full">
            <StatefulDataTable data={previewRows ?? submissions} isLoading={false} columns={promptQueueColumns} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
