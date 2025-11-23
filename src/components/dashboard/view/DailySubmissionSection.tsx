import { actions } from "astro:actions";
import { useLayoutEffect, useRef, useState } from "react";
import { DailyUploadCard } from "./DailyUploadCard";

interface DailySubmissionSectionProps {
  teamId: string;
}

export function DailySubmissionSection({ teamId }: DailySubmissionSectionProps) {
  const [isLoading, setIsLoading] = useState(false);
  const infoRef = useRef<HTMLDivElement | null>(null);
  const [containerHeight, setContainerHeight] = useState<number | undefined>(undefined);

  const handleSubmit = async (prompts: string[]): Promise<{ prompt: string; response?: string }[] | null> => {
    if (!prompts || prompts.length === 0 || isLoading) return null;
    setIsLoading(true);
    try {
      const result = await actions.submissions.uploadDailyPrompts({ teamId, prompts });
      const returned = result?.data?.data ?? null;
      return returned && Array.isArray(returned) ? returned : null;
    } catch (_e) {
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  useLayoutEffect(() => {
    if (typeof window === "undefined") return;
    const measure = () => {
      const info = infoRef.current;
      if (!info) {
        setContainerHeight(undefined);
        return;
      }
      // Only constrain on large screens where we display two columns.
      if (window.innerWidth >= 1024) {
        setContainerHeight(info.clientHeight);
      } else {
        setContainerHeight(undefined);
      }
    };

    measure();

    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(measure) : null;
    if (ro && infoRef.current) ro.observe(infoRef.current);
    window.addEventListener("resize", measure);

    return () => {
      if (ro && infoRef.current) ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  return (
    <div className="space-y-8 px-8 py-8">
      {/* Hero Section */}
      <div className="space-y-4 text-center">
        <h2 className="font-bold text-2xl text-neutral-900">Playground di Test</h2>
        <p className="mx-auto max-w-2xl text-lg text-neutral-600">
          Carica i tuoi prompt in un ambiente sicuro per testare e ottimizzare prima dell'invio finale. Ottieni
          valutazioni preliminari e migliora le tue strategie.
        </p>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-2">
        <DailyUploadCard containerHeight={containerHeight} isLoading={isLoading} onSubmit={handleSubmit} />
        {/* Info Section */}
        <div ref={infoRef} className="h-full space-y-6">
          <div className="rounded-lg border border-neutral-200 bg-white p-6">
            <h3 className="mb-4 font-semibold text-lg text-neutral-800">Come Funziona</h3>
            <div className="space-y-3 text-neutral-600 text-sm">
              <p>
                Carica fino a 25 prompt al giorno per ottenere valutazioni preliminari da un modello di linguaggio.
                Questo ti aiuta a testare strategie diverse prima dell'invio ufficiale.
              </p>
              <p>
                Ogni prompt riceve un punteggio provvisorio basato su sicurezza, chiarezza e contesto culturale
                italiano.
              </p>
            </div>
          </div>

          <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-6">
            <h3 className="mb-4 font-semibold text-lg text-yellow-800">Consigli Importanti</h3>
            <ul className="space-y-3 text-sm text-yellow-700">
              <li className="flex items-start gap-2">
                <span className="text-yellow-600">⚠️</span>
                <span>
                  <strong>Nessun duplicato:</strong> Evita righe ripetute nel file per risultati accurati.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-600">⚠️</span>
                <span>
                  <strong>Pensa prima di inviare:</strong> L'upload è definitivo per questa sessione.
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-600">⚠️</span>
                <span>
                  <strong>Esplora contesti:</strong> Prova diversi aspetti culturali italiani e di sicurezza.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
