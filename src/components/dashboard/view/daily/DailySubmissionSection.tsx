import { actions } from "astro:actions";
import { AlertTriangle } from "lucide-react";
import { useState } from "react";
import { dailyUploadConfig, UploadCard } from "../../shared";

interface DailySubmissionSectionProps {
  teamId: string;
  disabled?: boolean;
}

export function DailySubmissionSection({ teamId, disabled = false }: DailySubmissionSectionProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isError, setIsError] = useState(false);

  const handleSubmit = async (prompts: string[]): Promise<{ prompt: string; response?: string }[] | null> => {
    if (!prompts || prompts.length === 0 || isLoading) return null;
    setIsLoading(true);
    try {
      const result = await actions.submissions.uploadDailyPrompts({ teamId, prompts });
      const returned = result?.data?.data ?? null;

      if (result.data.success && Array.isArray(returned) && returned.length > 0) {
        setIsSubmitted(true);
      } else {
        setIsError(true);
      }

      return returned && Array.isArray(returned) ? returned : null;
    } catch (_e) {
      setIsError(true);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="scroll-mt-16 space-y-8 px-4 py-8 sm:px-8" id="playground">
      {/* Hero Section */}
      <div className="space-y-4 text-center">
        <h2 className="font-bold text-2xl text-neutral-900">Playground</h2>
        <p className="mx-auto max-w-2xl text-lg text-neutral-600">
          Carica i tuoi prompt ogni giorno per testare e migliorare prima dell'invio finale. Ottieni valutazioni
          preliminari e scopri prompt più efficaci.
        </p>
      </div>

      {/* Main Content Grid */}
      <div className="flex flex-col items-stretch gap-8 lg:flex-row">
        <div className="h-full space-y-6 lg:flex-1">
          <div className="rounded-lg border border-neutral-200 bg-white p-6">
            <h3 className="mb-4 font-semibold text-lg text-neutral-800">Come Funziona</h3>
            <div className="space-y-3 text-neutral-600 text-sm">
              <p>
                Puoi caricare fino a 25 prompt al giorno per ottenere delle valutazioni preliminari che ti aiutano a
                testare strategie diverse prima dell'invio ufficiale.
              </p>
              <p>
                Ogni prompt riceve un punteggio provvisorio da un singolo modello di linguaggio. Nella consegna finale,
                i prompt verranno valutati da diversi modelli e combinati per una valutazione più accurata.
              </p>
              <p>
                <strong>Formato del file:</strong> Carica un file di testo semplice dove ogni riga contiene un singolo
                prompt.
              </p>
            </div>
          </div>

          <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-6">
            <h3 className="mb-4 font-semibold text-lg text-yellow-800">Consigli Importanti</h3>
            <ul className="space-y-3 text-sm text-yellow-700">
              <li className="flex items-start gap-2 align-middle">
                <AlertTriangle size={16} className="text-yellow-600" />
                <span>Leggi bene tutte le istruzioni prima di procedere.</span>
              </li>
              <li className="flex items-start gap-2 align-middle">
                <AlertTriangle size={16} className="text-yellow-600" />
                <span>Prompt identici a quelli già inviati saranno scartati.</span>
              </li>
              <li className="flex items-start gap-2 align-middle">
                <AlertTriangle size={16} className="text-yellow-600" />
                <span>Puoi effettuare un solo upload giornaliero per team.</span>
              </li>
              <li className="flex items-start gap-2 align-middle">
                <AlertTriangle size={16} className="text-yellow-600" />
                <span>Prova diversi aspetti culturali italiani e di sicurezza.</span>
              </li>
            </ul>
          </div>
        </div>
        <div className="h-[500px] lg:h-auto lg:flex-1">
          <UploadCard
            config={dailyUploadConfig}
            isLoading={isLoading}
            onSubmit={handleSubmit}
            disabled={disabled}
            completed={isSubmitted || disabled}
            isError={isError}
          />
        </div>
      </div>
    </div>
  );
}
