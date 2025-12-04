import { actions } from "astro:actions";
import { AlertTriangle, CheckCircle, Trophy } from "lucide-react";
import { useState } from "react";
import { MAX_FINAL_PROMPTS } from "@/lib/consts";
import { finalUploadConfig, UploadCard } from "../../shared";

interface FinalSubmissionSectionProps {
  teamId: string;
  disabled?: boolean;
}

export function FinalSubmissionSection({ teamId, disabled = false }: FinalSubmissionSectionProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const handleSubmit = async (prompts: string[]): Promise<{ prompt: string; response?: string }[] | null> => {
    if (!prompts || prompts.length === 0 || isLoading) return null;
    setIsLoading(true);
    try {
      const result = await actions.submissions.uploadFinalPrompts({ teamId, prompts });
      const returned = result?.data?.data ?? null;
      if (returned && Array.isArray(returned)) {
        setIsCompleted(true);
      }
      return returned && Array.isArray(returned) ? returned : null;
    } catch (_e) {
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="scroll-mt-16 space-y-8 px-4 py-8 sm:px-8" id="final-submission">
      {/* Hero Section */}
      <div className="space-y-4 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-indigo-100">
          <Trophy className="h-8 w-8 text-indigo-600" />
        </div>
        <h2 className="font-bold text-2xl text-neutral-900">Consegna Finale</h2>
        <p className="mx-auto max-w-2xl text-lg text-neutral-600">
          Carica i tuoi {MAX_FINAL_PROMPTS} prompt finali per la valutazione ufficiale. Questa submission sarà usata per
          la classifica finale della competizione.
        </p>
      </div>

      {/* Main Content Grid */}
      <div className="flex flex-col items-stretch gap-8 lg:flex-row">
        <div className="h-full space-y-6 lg:flex-1">
          <div className="rounded-lg border border-indigo-200 bg-white p-6">
            <h3 className="mb-4 font-semibold text-indigo-800 text-lg">Come Funziona l'Invio Finale</h3>
            <div className="space-y-3 text-neutral-600 text-sm">
              <p>
                L'invio finale è l'ultima fase della competizione. Devi caricare esattamente{" "}
                <strong>{MAX_FINAL_PROMPTS} prompt</strong> che saranno valutati per determinare la classifica finale.
              </p>
              <p>
                A differenza del playground, i prompt finali verranno valutati da <strong>tutti i modelli</strong>{" "}
                disponibili e i punteggi saranno combinati per una valutazione più accurata e completa.
              </p>
              <p>
                <strong>Formato del file:</strong> Carica un file di testo semplice dove ogni riga contiene un singolo
                prompt.
              </p>
            </div>
          </div>

          <div className="rounded-lg border border-indigo-200 bg-indigo-50 p-6">
            <h3 className="mb-4 font-semibold text-indigo-800 text-lg">Checklist Prima dell'Invio</h3>
            <ul className="space-y-3 text-indigo-700 text-sm">
              <li className="flex items-start gap-2 align-middle">
                <CheckCircle size={16} className="text-indigo-600" />
                <span>
                  Assicurati di avere esattamente <strong>{MAX_FINAL_PROMPTS} prompt</strong> nel file.
                </span>
              </li>
              <li className="flex items-start gap-2 align-middle">
                <CheckCircle size={16} className="text-indigo-600" />
                <span>Verifica che tutti i prompt siano in italiano.</span>
              </li>
              <li className="flex items-start gap-2 align-middle">
                <CheckCircle size={16} className="text-indigo-600" />
                <span>Controlla che non ci siano prompt duplicati o troppo simili.</span>
              </li>
              <li className="flex items-start gap-2 align-middle">
                <CheckCircle size={16} className="text-indigo-600" />
                <span>Rivedi i migliori prompt testati nel playground.</span>
              </li>
            </ul>
          </div>

          <div className="rounded-lg border border-red-200 bg-red-50 p-6">
            <h3 className="mb-4 font-semibold text-lg text-red-800">Attenzione</h3>
            <ul className="space-y-3 text-red-700 text-sm">
              <li className="flex items-start gap-2 align-middle">
                <AlertTriangle size={16} className="text-red-600" />
                <span>
                  <strong>L'invio finale può essere effettuato una sola volta.</strong>
                </span>
              </li>
              <li className="flex items-start gap-2 align-middle">
                <AlertTriangle size={16} className="text-red-600" />
                <span>Non sarà possibile modificare i prompt dopo l'invio.</span>
              </li>
              <li className="flex items-start gap-2 align-middle">
                <AlertTriangle size={16} className="text-red-600" />
                <span>Assicurati che tutti i membri del team siano d'accordo prima di procedere.</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="h-[500px] lg:h-auto lg:flex-1">
          <UploadCard
            config={finalUploadConfig}
            isLoading={isLoading}
            onSubmit={handleSubmit}
            disabled={disabled && !isLoading}
            completed={isCompleted || disabled}
          />
        </div>
      </div>
    </div>
  );
}
