import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type JoinCodeButtonProps = {
  teamJoinCode: string;
};

export default function JoinCodeButton({ teamJoinCode }: JoinCodeButtonProps) {
  const [isJoinCodeCopied, setJoinCodeCopied] = useState(false);

  const onClick = async () => {
    try {
      await navigator.clipboard.writeText(teamJoinCode);
      setJoinCodeCopied(true);
      toast.success("Codice copiato negli appunti", {
        duration: 2000,
        position: "top-center",
        id: "copy-join-code-success",
      });
      setTimeout(() => setJoinCodeCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy join code to clipboard", err);
      toast.error("Impossibile copiare il codice negli appunti", {
        duration: 2000,
        position: "top-center",
        id: "copy-join-code-failure",
      });
    }
  };

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Copia codice invito"
      className="group flex w-full items-center justify-center gap-2 rounded-md bg-sky-50 px-4 py-2 font-mono font-semibold text-base text-sky-900 ring-1 ring-sky-200 transition-all hover:bg-sky-100 hover:shadow-sm hover:ring-sky-300"
    >
      <span className="tracking-widest">{teamJoinCode}</span>
      {isJoinCodeCopied ? (
        <Check className="h-4 w-4 text-sky-600 transition-transform group-active:scale-95" aria-hidden="true" />
      ) : (
        <Copy className="h-4 w-4 text-sky-600 transition-transform group-hover:scale-110" aria-hidden="true" />
      )}
      <span className="sr-only">Copia il codice invito</span>
    </button>
  );
}
