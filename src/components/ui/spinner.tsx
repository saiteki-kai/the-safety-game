import { Loader2Icon } from "lucide-react";

import { cn } from "@/lib/utils";

function Spinner({ className, ...props }: React.ComponentProps<"svg">) {
  // TEMPORARY: Using hardcoded Italian
  return (
    <Loader2Icon role="status" aria-label={"Caricamento..."} className={cn("size-4 animate-spin", className)} {...props} />
  );
}

export { Spinner };
