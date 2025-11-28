import Icon from "@components/common/Icon";
import { Button } from "@components/ui/button";
import { ScrollArea } from "@components/ui/scroll-area";
import { Spinner } from "@components/ui/spinner";
import { Tooltip, TooltipContent, TooltipTrigger } from "@components/ui/tooltip";
import { AlertTriangle, FileSpreadsheet, Info as InfoIcon, Trash2 } from "lucide-react";
import type React from "react";
import type { ChangeEvent, DragEvent } from "react";
import { useRef, useState } from "react";
import { MAX_DAILY_PROMPTS } from "@/lib/consts";

interface DailyUploadCardProps {
  isLoading: boolean;
  onSubmit: (prompts: string[]) => Promise<{ prompt: string; response?: string }[] | null>;
  disabled?: boolean;
}

const MAX_FILE_BYTES = 20_000_000; // 20 MB
const INPUT_ID = "daily-text-upload";

// Centralized error messages
const ERRORS = {
  FILE_TOO_LARGE: "File troppo grande. Max 20 MB",
  READ_ERROR: "Errore durante la lettura del file.",
  SERVER_ERROR: "Errore dal server durante l'upload.",
  INVALID_TYPE: "Formato file non supportato. Usa file di testo (.txt).",
} as const;

/** Safe trim to string */
const trimValue = (v: unknown) => String(v ?? "").trim();

/** Map text lines to prompt strings (trimmed). */
const mapLinesToPrompts = (lines: string[]): string[] =>
  lines.map((l) => String(l ?? "").trim()).filter((s) => s !== "");

/** Check if the file looks like a plain text file by extension or mime. */
const isTextFile = (file: File) => {
  const name = file.name || "";
  const ext = name.split(".").pop()?.toLowerCase() ?? "";
  if (ext === "txt") return true;
  const mime = file.type || "";
  return mime.startsWith("text/") || mime.includes("plain");
};

/** Parse a plain text File by reading lines. Trims values and skips empty lines. */
const parseFile = async (file: File): Promise<string[]> => {
  try {
    const text = await file.text();
    const lines = text.split(/\r?\n/).map((l) => trimValue(l));
    return mapLinesToPrompts(lines);
  } catch (err) {
    throw err instanceof Error ? err : new Error(String(err));
  }
};

export function DailyUploadCard({ isLoading, onSubmit, disabled = false }: DailyUploadCardProps): React.ReactElement {
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
  const isPromptTooLarge = promptCount > MAX_DAILY_PROMPTS;
  const isBadgeProblem = isPromptZero || isPromptTooLarge;
  const badgeTitle = isPromptZero
    ? "Attenzione: nessun prompt nel file. Carica almeno un prompt"
    : isPromptTooLarge
      ? `Attenzione: il file contiene ${promptCount} prompt. E' possibile caricare al massimo ${MAX_DAILY_PROMPTS} prompt al giorno.`
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

    if (!isTextFile(file)) {
      setError(ERRORS.INVALID_TYPE);
      setSelectedFileName(file.name);
      setPrompts([]);
      return;
    }

    setSelectedFileName(file.name);

    try {
      const mapped = await parseFile(file);
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
    if (prompts.length === 0 || isLoading || disabled) return;
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
            accept="text/plain"
            className="sr-only"
            onChange={handleFileChange}
            disabled={isLoading || disabled}
          />
        </div>

        {prompts.length === 0 ? (
          <fieldset
            aria-describedby="upload-instructions"
            onDragOver={
              disabled
                ? undefined
                : (event) => {
                    event.preventDefault();
                    setIsDragActive(true);
                  }
            }
            onDragLeave={disabled ? undefined : () => setIsDragActive(false)}
            onDrop={disabled ? undefined : handleDrop}
            className={`relative h-full min-h-0 flex-1 rounded-lg border bg-white p-4 sm:p-6 ${
              isDragActive ? "border-amber-300 ring-2 ring-amber-200/60" : "border-neutral-200"
            } ${prompts.length === 0 ? "flex items-center justify-center" : ""} ${disabled ? "cursor-not-allowed" : ""}`}
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

            <div id="upload-instructions" className="text-neutral-500 text-sm transition-all duration-300 ease-in-out">
              {disabled ? (
                <div className="fade-in-0 zoom-in-95 animate-in text-center duration-500">
                  <div className="mx-auto">
                    <Icon name="check-circle" size={32} className="text-blue-600 drop-shadow-sm" />
                  </div>
                  <div className="mt-4 space-y-3">
                    <h4 className="font-bold text-blue-900 text-xl">🎉 Invio Completato!</h4>
                    <p className="text-base text-blue-800 leading-relaxed">
                      Hai già effettuato l'invio giornaliero oggi.
                      <br />
                      <span className="font-medium">Torna domani per il prossimo round!</span>
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg bg-violet-50 p-2">
                    <Icon name="upload" size={18} className="text-violet-700" />
                  </div>
                  <div className="mt-6 flex items-center justify-center gap-2">
                    <label htmlFor={INPUT_ID} className="cursor-pointer font-semibold text-violet-700 hover:underline">
                      Clicca per caricare
                    </label>
                    <span className="text-neutral-500">o trascina qui il file</span>
                  </div>
                  <div className="mt-2 text-neutral-500 text-xs">File di testo (una riga = un prompt) · Max 20 MB</div>
                </div>
              )}
            </div>
          </fieldset>
        ) : (
          <ScrollArea className="relative h-full overflow-hidden rounded-lg border border-neutral-200 bg-white text-neutral-700 text-sm">
            <div className="relative md:absolute md:inset-0">
              <ul className="flex flex-col gap-2 bg-white p-4 text-neutral-700 text-sm sm:p-6">
                {prompts.map((s, index) => (
                  <li key={`preview-${index}-${(s ?? "").slice(0, 30)}`} className="flex items-start gap-2">
                    <span className="shrink-0 text-neutral-400">•</span>
                    <span className="leading-tight">{s}</span>
                  </li>
                ))}
              </ul>
            </div>
          </ScrollArea>
        )}

        <div className="mt-3 flex flex-col sm:flex-row sm:items-center sm:gap-3">
          {!disabled && !isLoading && (
            <div className="flex h-9 items-center rounded-md border bg-white px-2 sm:flex-1">
              <div className="flex min-w-0 grow items-center gap-2">
                <FileSpreadsheet size={14} className="text-neutral-900" />
                <span className="truncate font-medium text-neutral-900 text-xs">{fileSummaryText}</span>
              </div>
              <div className="ml-auto flex items-center gap-2">
                {isBadgeProblem ? (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span
                        className={`inline-flex items-center rounded-full bg-red-50 px-2 py-0.5 font-semibold text-red-700 text-xs`}
                      >
                        <InfoIcon size={12} className="mr-1 text-red-700" />
                        {promptCountLabel}
                      </span>
                    </TooltipTrigger>
                    <TooltipContent sideOffset={6}>
                      <span className="max-w-xs whitespace-normal text-xs">{badgeTitle}</span>
                    </TooltipContent>
                  </Tooltip>
                ) : promptCount < MAX_DAILY_PROMPTS ? (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span
                        className={`inline-flex items-center rounded-full bg-yellow-50 px-2 py-0.5 font-semibold text-xs text-yellow-700`}
                      >
                        <InfoIcon size={12} className="mr-1 text-yellow-700" />
                        {promptCountLabel}
                      </span>
                    </TooltipTrigger>
                    <TooltipContent sideOffset={6}>
                      <span className="max-w-xs whitespace-normal text-xs">
                        Puoi caricare altri {MAX_DAILY_PROMPTS - promptCount} prompt
                      </span>
                    </TooltipContent>
                  </Tooltip>
                ) : (
                  <span
                    className={`inline-flex items-center rounded-full bg-violet-50 px-2 py-0.5 font-semibold text-violet-700 text-xs`}
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
            {!disabled && (
              <Button
                type="button"
                variant={prompts.length > 0 && !isBadgeProblem ? "default" : "outline"}
                className="h-9 w-full font-semibold text-sm"
                disabled={isLoading || isBadgeProblem || disabled}
                aria-disabled={isLoading || isBadgeProblem || disabled}
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
