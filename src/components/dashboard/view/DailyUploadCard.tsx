import Icon from "@components/common/Icon";
import { Button } from "@components/ui/button";
import { Spinner } from "@components/ui/spinner";
import { Tooltip, TooltipContent, TooltipTrigger } from "@components/ui/tooltip";
import { AlertTriangle, FileSpreadsheet, Info as InfoIcon, Trash2 } from "lucide-react";
import Papa from "papaparse";
import type React from "react";
import type { ChangeEvent, DragEvent } from "react";
import { useRef, useState } from "react";

interface DailyUploadCardProps {
  containerHeight?: number;
  isLoading: boolean;
  onSubmit: (prompts: string[]) => Promise<{ prompt: string; response?: string }[] | null>;
}

const MAX_FILE_BYTES = 20_000_000; // 20 MB
const INPUT_ID = "daily-csv-upload";

// Centralized error messages
const ERRORS = {
  FILE_TOO_LARGE: "File troppo grande. Max 20 MB",
  READ_ERROR: "Errore durante la lettura del file.",
  SERVER_ERROR: "Errore dal server durante l'upload.",
  INVALID_TYPE: "Formato file non supportato. Usa CSV.",
} as const;

/** Safe trim to string */
const trimValue = (v: unknown) => String(v ?? "").trim();

/** Map parsed Papa rows to prompt strings (first column, trimmed). */
const mapRowsToPrompts = (rows: string[][]): string[] =>
  rows
    .filter((r) => r.length > 0 && r.some((c) => (c ?? "") !== ""))
    .map((r) => String(r[0] ?? ""))
    .filter((s) => s !== "");

/** Check if the file looks like a CSV by extension or mime. */
const isCsvFile = (file: File) => {
  const name = file.name || "";
  const ext = name.split(".").pop()?.toLowerCase() ?? "";
  if (ext === "csv") return true;
  const mime = file.type || "";
  return mime.includes("csv");
};

/** Parse a File using PapaParse. Trims values and skips empty lines. */
const parseFile = (file: File): Promise<string[][]> =>
  new Promise((resolve, reject) => {
    try {
      const useWorker = (file.size ?? 0) > 2_000_000; // use worker for files larger than 2MB
      Papa.parse<string[]>(file, {
        worker: useWorker,
        skipEmptyLines: true,
        transform: (v) => trimValue(v),
        complete: (result) => {
          if (result.errors && result.errors.length > 0) {
            const msg = result.errors
              .map((e) => `${e.message}${typeof e.row === "number" ? ` (row ${e.row})` : ""}`)
              .join("; ");
            return reject(new Error(msg || "CSV parse error"));
          }
          return resolve(result.data as unknown as string[][]);
        },
        error: (err) => reject(err instanceof Error ? err : new Error(String(err))),
      });
    } catch (err) {
      reject(err instanceof Error ? err : new Error(String(err)));
    }
  });

export function DailyUploadCard({ containerHeight, isLoading, onSubmit }: DailyUploadCardProps): React.ReactElement {
  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [prompts, setPrompts] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fileSummaryText = selectedFileName
    ? selectedFileName
    : prompts.length > 0
      ? `${prompts.length} prompt`
      : "Seleziona un file per la valutazione";

  const promptCountLabel = (
    <>
      <span className="block sm:hidden">{prompts.length}</span>
      <span className="hidden sm:inline">{prompts.length} prompt</span>
    </>
  );

  const promptCount = prompts.length;
  const isPromptZero = promptCount === 0;
  const isPromptTooLarge = promptCount > 25;
  const isBadgeProblem = isPromptZero || isPromptTooLarge;
  const badgeTitle = isPromptZero
    ? "Attenzione: nessun prompt nel file. Carica almeno un prompt"
    : isPromptTooLarge
      ? `Attenzione: il file contiene ${promptCount} prompt. E' possibile caricare al massimo 25 prompt al giorno.`
      : "";

  const hasSelection = !!selectedFileName || prompts.length > 0;

  /** Handle file drop into the fieldset */
  const handleDrop = async (event: DragEvent<HTMLFieldSetElement>) => {
    event.preventDefault();
    setIsDragActive(false);
    const droppedFile = event.dataTransfer?.files?.[0] ?? null;
    if (!droppedFile) return;
    try {
      await processFile(droppedFile);
    } catch (err) {
      setError(err instanceof Error ? err.message : ERRORS.READ_ERROR);
    }
  };

  /**
   * Process a selected File: validate size/type, parse rows and set prompts state.
   */
  const processFile = async (file?: File | null) => {
    setError(null);
    if (!file) {
      setSelectedFileName(null);
      setPrompts([]);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    if (file.size > MAX_FILE_BYTES) {
      setError(ERRORS.FILE_TOO_LARGE);
      setSelectedFileName(file.name);
      setPrompts([]);
      return;
    }

    if (!isCsvFile(file)) {
      setError(ERRORS.INVALID_TYPE);
      setSelectedFileName(file.name);
      setPrompts([]);
      return;
    }

    setSelectedFileName(file.name);

    try {
      const rows = await parseFile(file);
      const mapped = mapRowsToPrompts(rows);
      setPrompts(mapped.length > 0 ? mapped : []);
    } catch (err) {
      const msg = err instanceof Error ? err.message : ERRORS.READ_ERROR;
      setError(msg);
      setPrompts([]);
    }
  };

  /** Handle change event from file input */
  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const f = event.target.files?.[0] ?? null;
    try {
      await processFile(f);
    } catch (err) {
      setError(err instanceof Error ? err.message : ERRORS.READ_ERROR);
    }
  };

  /** Clear the selected file and prompts */
  const handleClear = () => {
    setSelectedFileName(null);
    setPrompts([]);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  /** Submit prompts via the provided onSubmit handler */
  const handleSubmitClick = async () => {
    if (prompts.length === 0 || isLoading) return;
    setError(null);
    const toSend = prompts.slice();
    try {
      const returned = await onSubmit(toSend);
      if (returned && Array.isArray(returned)) {
        const updatedPrompts: string[] = returned.map((s) => String(s.prompt ?? ""));
        setPrompts(updatedPrompts);
        setSelectedFileName(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
      } else {
        setError(ERRORS.SERVER_ERROR);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : ERRORS.SERVER_ERROR);
    }
  };

  return (
    <div className="h-full min-h-0" style={containerHeight ? { height: `${containerHeight}px` } : undefined}>
      <div className="h-full min-h-0 rounded-2xl border-2 border-neutral-200 border-dashed bg-neutral-50 p-6">
        <div className="flex h-full min-h-0 flex-col">
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <h3 className="font-semibold text-neutral-900 text-xl leading-tight">Carica Prompt</h3>
                <p className="mt-1 text-neutral-600 text-sm">Invia i tuoi prompt per la valutazione giornaliera</p>
              </div>
            </div>

            <div className="h-0" aria-hidden />
            <input
              id={INPUT_ID}
              ref={fileInputRef}
              type="file"
              accept=".csv"
              className="sr-only"
              onChange={handleFileChange}
              disabled={isLoading}
            />
          </div>

          <fieldset
            aria-describedby="upload-instructions"
            onDragOver={(event) => {
              event.preventDefault();
              setIsDragActive(true);
            }}
            onDragLeave={() => setIsDragActive(false)}
            onDrop={handleDrop}
            className={`relative h-full min-h-0 flex-1 overflow-y-auto rounded-lg border bg-white p-4 ${
              isDragActive ? "border-amber-300 ring-2 ring-amber-200/60" : "border-neutral-200"
            } ${prompts.length === 0 ? "flex items-center justify-center" : ""}`}
          >
            {error && (
              <output
                aria-live="polite"
                className="-translate-x-1/2 absolute bottom-3 left-1/2 z-10 inline-flex items-center gap-2 rounded-full bg-red-600 px-3 py-1 text-sm text-white shadow"
              >
                <AlertTriangle className="h-4 w-4 shrink-0 text-white" />
                <span className="sr-only">Errore: </span>
                <span>{error}</span>
              </output>
            )}
            {prompts.length === 0 ? (
              <div id="upload-instructions" className="text-neutral-500 text-sm">
                <div className="text-center">
                  <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg bg-violet-50 p-2">
                    <Icon name="upload" size={18} className="text-violet-700" />
                  </div>
                  <div className="mt-3 flex items-center justify-center gap-2">
                    <label htmlFor={INPUT_ID} className="cursor-pointer font-semibold text-violet-700 hover:underline">
                      Clicca per caricare
                    </label>
                    <span className="text-neutral-500">o trascina qui il file</span>
                  </div>
                  <div className="mt-2 text-neutral-500 text-xs">CSV · Max 20 MB</div>
                </div>
              </div>
            ) : (
              <ul className="flex flex-col gap-2 text-neutral-700 text-sm">
                {prompts.map((s, index) => (
                  <li key={`preview-${index}-${(s ?? "").slice(0, 30)}`} className="flex items-start gap-2">
                    <span className="shrink-0 text-neutral-400">•</span>
                    <span className="leading-tight">{s}</span>
                  </li>
                ))}
              </ul>
            )}
          </fieldset>

          <div className="mt-3 flex flex-col sm:flex-row sm:items-center sm:gap-3">
            {!isLoading && (
              <div className="flex h-9 items-center rounded-md border bg-white px-2 sm:flex-1">
                <div className="flex min-w-0 grow items-center gap-2">
                  <FileSpreadsheet size={18} className="text-neutral-900" />
                  <span className="truncate font-medium text-neutral-900 text-sm">{fileSummaryText}</span>
                </div>
                <div className="ml-auto flex items-center gap-2">
                  {isBadgeProblem ? (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span
                          className={`inline-flex items-center rounded-full bg-red-50 px-2 py-0.5 font-semibold text-[12px] text-red-700`}
                        >
                          <InfoIcon size={12} className="mr-1 text-red-700" />
                          {promptCountLabel}
                        </span>
                      </TooltipTrigger>
                      <TooltipContent sideOffset={6}>
                        <span className="max-w-xs whitespace-normal text-xs">{badgeTitle}</span>
                      </TooltipContent>
                    </Tooltip>
                  ) : (
                    <span
                      className={`inline-flex items-center rounded-full bg-violet-50 px-2 py-0.5 font-semibold text-[12px] text-violet-700`}
                    >
                      {promptCountLabel}
                    </span>
                  )}
                  <div aria-hidden className="h-5 w-px bg-neutral-200" />
                  <button
                    type="button"
                    aria-label="Cancella file"
                    onClick={hasSelection ? handleClear : undefined}
                    className={`rounded-md p-1.5 ${hasSelection ? "text-neutral-500 hover:text-neutral-700" : "cursor-not-allowed text-neutral-300"}`}
                    disabled={!hasSelection}
                  >
                    <Trash2 size={14} className={hasSelection ? "text-neutral-500" : "text-neutral-300"} />
                  </button>
                </div>
              </div>
            )}

            <div className={isLoading ? "mt-2 w-full sm:mt-0 sm:flex-1" : "mt-2 w-full sm:mt-0 sm:w-28"}>
              <Button
                type="button"
                variant={prompts.length > 0 && !isBadgeProblem ? "default" : "outline"}
                className="h-9 w-full font-semibold text-sm"
                disabled={isLoading || isBadgeProblem}
                aria-disabled={isLoading || isBadgeProblem}
                onClick={handleSubmitClick}
                aria-busy={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-2 text-sm">
                    <Spinner />
                    <span className="truncate">Valutazione in corso — potrebbe richiedere qualche minuto.</span>
                  </span>
                ) : (
                  "Invia"
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
