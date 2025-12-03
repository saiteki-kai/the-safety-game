import Icon from "@components/common/Icon";
import { Button } from "@components/ui/button";
import { ScrollArea } from "@components/ui/scroll-area";
import { Spinner } from "@components/ui/spinner";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@components/ui/tooltip";
import {
  AlertTriangle,
  FileSpreadsheet,
  Info as InfoIcon,
  Trash2,
} from "lucide-react";
import type React from "react";
import type { ChangeEvent, DragEvent } from "react";
import { useRef, useState } from "react";

import { isTextFile, MAX_FILE_BYTES, parseFile, UPLOAD_ERRORS } from "./upload-utils";

// ============================================================================
// Types
// ============================================================================

export interface UploadCardLabels {
  title: string;
  subtitle: string;
  completedTitle: string;
  completedSubtitle: string;
  uploadLabel: string;
  uploadHint: string;
  filePlaceholder: string;
  submitButton: string;
  loadingText: string;
  belowMaxMessage: (remaining: number, max: number) => string;
  overMaxMessage: (count: number, max: number) => string;
}

export interface UploadCardConfig {
  maxPrompts: number;
  requireExactCount: boolean;
  labels: UploadCardLabels;
  inputId: string;
}

export interface UploadCardProps {
  config: UploadCardConfig;
  isLoading: boolean;
  onSubmit: (
    prompts: string[]
  ) => Promise<{ prompt: string; response?: string }[] | null>;
  disabled?: boolean;
  completed?: boolean;
}

// ============================================================================
// Sub-components
// ============================================================================

interface CompletedStateProps {
  title: string;
  subtitle: string;
}

function CompletedState({ title, subtitle }: CompletedStateProps) {
  return (
    <div className="flex h-full min-h-0 flex-1 items-center justify-center rounded-lg border border-neutral-200 bg-white p-4 sm:p-6">
      <div className="fade-in-0 zoom-in-95 animate-in text-center duration-500">
        <div className="mx-auto">
          <Icon name="check-circle" size={32} className="text-indigo-600 drop-shadow-sm" />
        </div>
        <div className="mt-4 space-y-3">
          <h4 className="font-bold text-xl text-indigo-900">{title}</h4>
          <p className="text-base leading-relaxed text-indigo-800">
            {subtitle.split("\n").map((line, i, arr) => {
              const parts = line.split(/(\*\*.*?\*\*)/g);
              return (
                <span key={i}>
                  {parts.map((part, j) => {
                    if (part.startsWith("**") && part.endsWith("**")) {
                      return (
                        <span key={j} className="font-medium">
                          {part.slice(2, -2)}
                        </span>
                      );
                    }
                    return part;
                  })}
                  {i < arr.length - 1 && <br />}
                </span>
              );
            })}
          </p>
        </div>
      </div>
    </div>
  );
}

interface UploadDropzoneProps {
  inputId: string;
  labels: UploadCardLabels;
  disabled: boolean;
  isDragActive: boolean;
  error: string | null;
  onDragOver: (event: DragEvent<HTMLFieldSetElement>) => void;
  onDragLeave: () => void;
  onDrop: (event: DragEvent<HTMLFieldSetElement>) => void;
}

function UploadDropzone({
  inputId,
  labels,
  disabled,
  isDragActive,
  error,
  onDragOver,
  onDragLeave,
  onDrop,
}: UploadDropzoneProps) {
  return (
    <fieldset
      aria-describedby="upload-instructions"
      onDragOver={disabled ? undefined : onDragOver}
      onDragLeave={disabled ? undefined : onDragLeave}
      onDrop={disabled ? undefined : onDrop}
      className={`relative flex h-full min-h-0 flex-1 items-center justify-center rounded-lg border bg-white p-4 sm:p-6 ${
        isDragActive ? "border-amber-300 ring-2 ring-amber-200/60" : "border-neutral-200"
      } ${disabled ? "cursor-not-allowed" : ""}`}
    >
      {error && <ErrorBanner message={error} />}

      <div
        id="upload-instructions"
        className="text-neutral-500 text-sm transition-all duration-300 ease-in-out"
      >
        <div className="text-center">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg bg-violet-50 p-2">
            <Icon name="upload" size={18} className="text-violet-700" />
          </div>
          <div className="mt-6 flex items-center justify-center gap-2">
            <label
              htmlFor={inputId}
              className="cursor-pointer font-semibold text-violet-700 hover:underline"
            >
              {labels.uploadLabel}
            </label>
            <span className="text-neutral-500">o trascina qui il file</span>
          </div>
          <div className="mt-2 text-neutral-500 text-xs">{labels.uploadHint}</div>
        </div>
      </div>
    </fieldset>
  );
}

interface PromptsPreviewProps {
  prompts: string[];
}

function PromptsPreview({ prompts }: PromptsPreviewProps) {
  return (
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
  );
}

interface ErrorBannerProps {
  message: string;
}

function ErrorBanner({ message }: ErrorBannerProps) {
  return (
    <output
      aria-live="polite"
      className="-translate-x-1/2 absolute bottom-3 left-1/2 z-10 inline-flex items-center gap-2 rounded-full bg-red-600 px-3 py-1 text-sm text-white shadow"
    >
      <AlertTriangle className="h-4 w-4 shrink-0 text-white" />
      <span className="sr-only">Errore: </span>
      <span>{message}</span>
    </output>
  );
}

interface PromptCountBadgeProps {
  count: number;
  maxPrompts: number;
  requireExactCount: boolean;
  labels: UploadCardLabels;
}

function PromptCountBadge({ count, maxPrompts, requireExactCount, labels }: PromptCountBadgeProps) {
  const isZero = count === 0;
  const isTooLarge = count > maxPrompts;
  const isCountMismatch = requireExactCount && count !== maxPrompts && count > 0;
  const isBelowMax = !requireExactCount && count < maxPrompts;

  const getBadgeClasses = () => {
    if (isZero || isTooLarge) return "bg-red-50 text-red-700";
    if (isCountMismatch || isBelowMax) return "bg-yellow-50 text-yellow-700";
    return "bg-indigo-50 text-indigo-700";
  };

  const getTooltipContent = () => {
    if (isZero) return "Attenzione: nessun prompt nel file. Carica almeno un prompt";
    if (isTooLarge) return labels.overMaxMessage(count, maxPrompts);
    if (isCountMismatch) return `Servono esattamente ${maxPrompts} prompt. Trovati: ${count}`;
    if (isBelowMax) return labels.belowMaxMessage(maxPrompts - count, maxPrompts);
    return "";
  };

  const needsTooltip = isZero || isTooLarge || isCountMismatch || isBelowMax;

  const promptCountLabel = (
    <>
      <span className="block sm:hidden">{count}</span>
      <span className="hidden sm:inline">{count} prompt</span>
    </>
  );

  if (needsTooltip) {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <span className={`inline-flex items-center rounded-full px-2 py-0.5 font-semibold text-xs ${getBadgeClasses()}`}>
            <InfoIcon size={12} className="mr-1" />
            {promptCountLabel}
          </span>
        </TooltipTrigger>
        <TooltipContent sideOffset={6}>
          <span className="max-w-xs whitespace-normal text-xs">{getTooltipContent()}</span>
        </TooltipContent>
      </Tooltip>
    );
  }

  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 font-semibold text-xs ${getBadgeClasses()}`}>
      {promptCountLabel}
    </span>
  );
}

interface FileInfoBarProps {
  fileName: string | null;
  promptCount: number;
  maxPrompts: number;
  requireExactCount: boolean;
  labels: UploadCardLabels;
  hasSelection: boolean;
  onClear: () => void;
}

function FileInfoBar({
  fileName,
  promptCount,
  maxPrompts,
  requireExactCount,
  labels,
  hasSelection,
  onClear,
}: FileInfoBarProps) {
  const fileSummaryText = fileName
    ? fileName
    : promptCount > 0
      ? `${promptCount} prompt`
      : labels.filePlaceholder;

  return (
    <div className="flex h-9 items-center rounded-md border border-neutral-200 bg-white px-2 sm:flex-1">
      <div className="flex min-w-0 grow items-center gap-2">
        <FileSpreadsheet size={14} className="text-neutral-900" />
        <span className="truncate font-medium text-xs text-neutral-900">{fileSummaryText}</span>
      </div>
      <div className="ml-auto flex items-center gap-2">
        <PromptCountBadge
          count={promptCount}
          maxPrompts={maxPrompts}
          requireExactCount={requireExactCount}
          labels={labels}
        />
        <div aria-hidden className="h-5 w-px bg-neutral-200" />
        <button
          type="button"
          aria-label="Cancella file"
          onClick={hasSelection ? onClear : undefined}
          className={`rounded-md p-1.5 ${hasSelection ? "text-neutral-500 hover:text-neutral-700" : "cursor-not-allowed text-neutral-300"}`}
          disabled={!hasSelection}
        >
          <Trash2 size={14} className={hasSelection ? "text-neutral-500" : "text-neutral-300"} />
        </button>
      </div>
    </div>
  );
}

interface SubmitButtonProps {
  isLoading: boolean;
  disabled: boolean;
  hasPrompts: boolean;
  isBadgeProblem: boolean;
  labels: UploadCardLabels;
  onSubmit: () => void;
}

function SubmitButton({ isLoading, disabled, hasPrompts, isBadgeProblem, labels, onSubmit }: SubmitButtonProps) {
  return (
    <Button
      type="button"
      variant={hasPrompts && !isBadgeProblem ? "default" : "outline"}
      className="h-9 w-full font-semibold text-sm hover:bg-violet-700"
      disabled={isLoading || isBadgeProblem || disabled}
      aria-disabled={isLoading || isBadgeProblem || disabled}
      onClick={onSubmit}
      aria-busy={isLoading}
    >
      {isLoading ? (
        <span className="flex items-center gap-2 text-sm">
          <Spinner />
          <span className="truncate">{labels.loadingText}</span>
        </span>
      ) : (
        labels.submitButton
      )}
    </Button>
  );
}

// ============================================================================
// Main Component
// ============================================================================

export function UploadCard({
  config,
  isLoading,
  onSubmit,
  disabled = false,
  completed = false,
}: UploadCardProps): React.ReactElement {
  const { maxPrompts, requireExactCount, labels, inputId } = config;

  const [isDragActive, setIsDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [prompts, setPrompts] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const promptCount = prompts.length;
  const isPromptZero = promptCount === 0;
  const isPromptTooLarge = promptCount > maxPrompts;
  const isCountMismatch = requireExactCount && promptCount !== maxPrompts && promptCount > 0;
  const isBadgeProblem = isPromptZero || isPromptTooLarge || isCountMismatch;
  const hasSelection = !!selectedFileName || prompts.length > 0;

  // -------------------------------------------------------------------------
  // Handlers
  // -------------------------------------------------------------------------

  const processFile = async (file?: File | null) => {
    setError(null);
    if (!file) {
      setSelectedFileName(null);
      setPrompts([]);
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    if (file.size > MAX_FILE_BYTES) {
      setError(UPLOAD_ERRORS.FILE_TOO_LARGE);
      setSelectedFileName(file.name);
      setPrompts([]);
      return;
    }

    if (!isTextFile(file)) {
      setError(UPLOAD_ERRORS.INVALID_TYPE);
      setSelectedFileName(file.name);
      setPrompts([]);
      return;
    }

    setSelectedFileName(file.name);

    try {
      const mapped = await parseFile(file);
      setPrompts(mapped.length > 0 ? mapped : []);
    } catch (err) {
      const msg = err instanceof Error ? err.message : UPLOAD_ERRORS.READ_ERROR;
      setError(msg);
      setPrompts([]);
    }
  };

  const handleDrop = async (event: DragEvent<HTMLFieldSetElement>) => {
    event.preventDefault();
    setIsDragActive(false);
    const droppedFile = event.dataTransfer?.files?.[0] ?? null;
    if (!droppedFile) return;
    try {
      await processFile(droppedFile);
    } catch (err) {
      setError(err instanceof Error ? err.message : UPLOAD_ERRORS.READ_ERROR);
    }
  };

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const f = event.target.files?.[0] ?? null;
    try {
      await processFile(f);
    } catch (err) {
      setError(err instanceof Error ? err.message : UPLOAD_ERRORS.READ_ERROR);
    }
  };

  const handleClear = () => {
    setSelectedFileName(null);
    setPrompts([]);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmitClick = async () => {
    if (prompts.length === 0 || isLoading || disabled || isBadgeProblem) return;
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
        setError(UPLOAD_ERRORS.SERVER_ERROR);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : UPLOAD_ERRORS.SERVER_ERROR);
    }
  };

  const handleDragOver = (event: DragEvent<HTMLFieldSetElement>) => {
    event.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = () => {
    setIsDragActive(false);
  };

  // -------------------------------------------------------------------------
  // Render content based on state (early returns)
  // -------------------------------------------------------------------------

  const renderContent = () => {
    if (completed) {
      return <CompletedState title={labels.completedTitle} subtitle={labels.completedSubtitle} />;
    }

    if (prompts.length === 0) {
      return (
        <UploadDropzone
          inputId={inputId}
          labels={labels}
          disabled={disabled}
          isDragActive={isDragActive}
          error={error}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        />
      );
    }

    return <PromptsPreview prompts={prompts} />;
  };

  const renderFooter = () => {
    if (completed) return null;

    return (
      <div className="mt-3 flex flex-col sm:flex-row sm:items-center sm:gap-3">
        {!disabled && !isLoading && (
          <FileInfoBar
            fileName={selectedFileName}
            promptCount={promptCount}
            maxPrompts={maxPrompts}
            requireExactCount={requireExactCount}
            labels={labels}
            hasSelection={hasSelection}
            onClear={handleClear}
          />
        )}

        <div className={isLoading ? "mt-2 w-full sm:mt-0 sm:flex-1" : "mt-2 w-full sm:mt-0 sm:w-28"}>
          {!disabled && (
            <SubmitButton
              isLoading={isLoading}
              disabled={disabled}
              hasPrompts={prompts.length > 0}
              isBadgeProblem={isBadgeProblem}
              labels={labels}
              onSubmit={handleSubmitClick}
            />
          )}
        </div>
      </div>
    );
  };

  // -------------------------------------------------------------------------
  // Main render
  // -------------------------------------------------------------------------

  return (
    <div className="h-full min-h-0 rounded-2xl border-2 border-dashed border-neutral-200 bg-neutral-50 p-6">
      <div className="flex h-full min-h-0 flex-col">
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <h3 className="font-semibold text-xl leading-tight text-neutral-900">{labels.title}</h3>
              <p className="mt-1 text-sm text-neutral-600">{labels.subtitle}</p>
            </div>
          </div>

          <div className="h-0" aria-hidden />
          <input
            id={inputId}
            ref={fileInputRef}
            type="file"
            accept="text/plain"
            className="sr-only"
            onChange={handleFileChange}
            disabled={isLoading || disabled}
          />
        </div>

        {renderContent()}
        {renderFooter()}
      </div>
    </div>
  );
}
