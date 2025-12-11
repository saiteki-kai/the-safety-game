import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { getTranslations, dashboardTranslations, type Locale, DEFAULT_LOCALE } from "@/lib/translations";

type JoinCodeButtonProps = {
  teamJoinCode: string;
  locale?: Locale;
};

export default function JoinCodeButton({ teamJoinCode, locale = DEFAULT_LOCALE }: JoinCodeButtonProps) {
  const t = getTranslations(dashboardTranslations, locale);

  const [isJoinCodeCopied, setJoinCodeCopied] = useState(false);

  const onClick = async () => {
    try {
      await navigator.clipboard.writeText(teamJoinCode);
      setJoinCodeCopied(true);
      toast.success(t.codeCopied, {
        duration: 2000,
        position: "top-center",
        id: "copy-join-code-success",
      });
      setTimeout(() => setJoinCodeCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy join code to clipboard", err);
      toast.error(t.codeCopyFailed, {
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
      aria-label={"Copy invite code"}
      className="group flex w-full items-center justify-center gap-2 rounded-md bg-sky-50 px-4 py-2 font-mono font-semibold text-base text-sky-900 ring-1 ring-sky-200 transition-all hover:bg-sky-100 hover:shadow-sm hover:ring-sky-300"
    >
      <span className="tracking-widest">{teamJoinCode}</span>
      {isJoinCodeCopied ? (
        <Check className="h-4 w-4 text-sky-600 transition-transform group-active:scale-95" aria-hidden="true" />
      ) : (
        <Copy className="h-4 w-4 text-sky-600 transition-transform group-hover:scale-110" aria-hidden="true" />
      )}
      <span className="sr-only">{"Copy invite code"}</span>
    </button>
  );
}
