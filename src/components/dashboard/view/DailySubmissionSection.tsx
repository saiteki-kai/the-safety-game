import { actions } from "astro:actions";
import { useLayoutEffect, useRef, useState } from "react";
import { DailyUploadCard } from "./DailyUploadCard";
import { AlertTriangle } from "lucide-react";

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
        <h2 className="font-bold text-2xl text-neutral-900">Playground</h2>
        <p className="mx-auto max-w-2xl text-lg text-neutral-600">
          Carica i tuoi prompt ogni giorno per testare e migliorare prima dell'invio finale. Ottieni
          valutazioni preliminari e scopri prompt più efficaci.
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
                Puoi caricare fino a 25 prompt al giorno per ottenere delle valutazioni preliminari che ti aiutano a testare strategie diverse prima dell'invio ufficiale.
              </p>
              <p>
                Ogni prompt riceve un punteggio provvisorio da un singolo modello di linguaggio. Nella consegna finale, i prompt verranno valutati da diversi modelli e combinati per una valutazione più accurata.
              </p>
            </div>
          </div>

          <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-6">
            <h3 className="mb-4 font-semibold text-lg text-yellow-800">Consigli Importanti</h3>
            <ul className="space-y-3 text-sm text-yellow-700">
              <li className="flex items-start align-middle gap-2">
                <AlertTriangle size={16} className="text-yellow-600" />
                <span>
                  Leggi bene tutte le istruzioni prima di procedere.
                </span>
              </li>
              <li className="flex items-start align-middle gap-2">
                <AlertTriangle size={16} className="text-yellow-600" />
                <span>
                  Prompt identici a quelli già inviati non saranno accettati.
                </span>
              </li>
              <li className="flex items-start align-middle gap-2">
                <AlertTriangle size={16} className="text-yellow-600" />
                <span>
                  Puoi effettuare un solo upload giornaliero per team.
                </span>
              </li>
              <li className="flex items-start align-middle gap-2">
                <AlertTriangle size={16} className="text-yellow-600" />
                <span>
                  Prova diversi aspetti culturali italiani e di sicurezza.
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
