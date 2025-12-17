import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type JoinCodeButtonProps = {
  teamJoinCode: string;
  copySuccessText?: string;
  copyFailureText?: string;
};

export default function JoinCodeButton({ teamJoinCode, copySuccessText, copyFailureText }: JoinCodeButtonProps) {

  const [isJoinCodeCopied, setJoinCodeCopied] = useState(false);

  const onClick = async () => {
    try {
      await navigator.clipboard.writeText(teamJoinCode);
      setJoinCodeCopied(true);
      // Include the locale in the toast id so language switches create/replace a locale-specific toast
      toast.success(copySuccessText, {
        duration: 2000,
        position: "bottom-center",
        id: "copy-join-code-success",
      });
      setTimeout(() => setJoinCodeCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy join code to clipboard", err);
      toast.error(copyFailureText, {
        duration: 2000,
        position: "bottom-center",
        id: "copy-join-code-failure",
      });
    }
  };

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={"Copy invite code"}
      className="relative group flex w-full items-center justify-center rounded-md bg-sky-50 px-4 py-2 pr-10 font-mono font-semibold text-base text-sky-900 ring-1 ring-sky-200 transition-all hover:bg-sky-100 hover:shadow-sm hover:ring-sky-300"
    >
      <span className="tracking-widest">{teamJoinCode}</span>

      <span className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
        {isJoinCodeCopied ? (
          <Check className="h-4 w-4 text-sky-600 transition-transform group-active:scale-95" aria-hidden="true" />
        ) : (
          <Copy className="h-4 w-4 text-sky-600 transition-transform group-hover:scale-110" aria-hidden="true" />
        )}
      </span>

      <span className="sr-only">{"Copy invite code"}</span>
    </button>
  );
}
