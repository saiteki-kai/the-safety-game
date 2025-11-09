import { Avatar, AvatarFallback, AvatarImage } from "@components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/ui/card";
import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import type { MemberSlot } from "../types";

type TeamOverviewCardProps = {
  teamName: string;
  teamJoinCode: string;
  memberSlots: MemberSlot[];
};

export default function TeamOverviewCard({ teamName, teamJoinCode, memberSlots }: TeamOverviewCardProps) {
  return (
    <Card className="flex h-full min-h-0 w-full flex-col">
      <CardHeader className="pb-0">
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <CardTitle className="text-lg text-neutral-900 lg:text-2xl">{teamName}</CardTitle>
            <JoinCodeButton teamJoinCode={teamJoinCode} />
          </div>
          <CardDescription className="max-w-prose text-neutral-500 text-sm leading-relaxed">
            Condividi il codice invito per permettere ai nuovi membri di unirsi subito.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="min-h-0 flex-1 space-y-4 pt-4">
        <div>
          <p className="mb-2 font-semibold text-neutral-500 text-xs uppercase tracking-wide">Membri del team</p>
          <ul className="grid grid-cols-1 gap-2 text-neutral-700 sm:grid-cols-2">
            {memberSlots.map((slot) => (
              <MemberItem key={slot.key} slot={slot} />
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

type JoinCodeButtonProps = {
  teamJoinCode: string;
};

function JoinCodeButton({ teamJoinCode }: JoinCodeButtonProps) {
  const [isJoinCodeCopied, setJoinCodeCopied] = useState(false);

  const onClick = async () => {
    toast.success("Codice copiato negli appunti", {
      duration: 2000,
      position: "top-center",
      id: "copy-join-code-success",
    });
    await navigator.clipboard.writeText(teamJoinCode);
    setJoinCodeCopied(true);
    setTimeout(() => setJoinCodeCopied(false), 2000);
  };

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Copia codice invito"
      className="group flex w-full items-center justify-between gap-3 rounded-md bg-white px-3 py-2 font-sans text-sky-900 text-sm ring-1 ring-neutral-200 transition-shadow hover:shadow-sm lg:w-auto lg:justify-center"
    >
      <span className="font-semibold text-base tracking-widest lg:font-medium lg:text-sm">{teamJoinCode}</span>
      {isJoinCodeCopied ? (
        <Check className="h-4 w-4 text-emerald-600 transition-transform group-active:scale-95" aria-hidden="true" />
      ) : (
        <Copy className="h-4 w-4 text-sky-500 transition-transform group-hover:scale-105" aria-hidden="true" />
      )}
      <span className="sr-only">Copia il codice invito</span>
    </button>
  );
}

type MemberItemProps = {
  slot: MemberSlot;
};

function MemberItem({ slot }: MemberItemProps) {
  const { name, initials, isPlaceholder, member } = slot;

  return (
    <li
      className={`flex min-w-0 items-center gap-3 rounded-md px-2 py-2 sm:px-3 ${isPlaceholder ? "border border-neutral-200 border-dashed bg-neutral-50 text-neutral-500" : "bg-transparent"}`}
    >
      <Avatar
        className={`h-10 w-10 shrink-0 border ${isPlaceholder ? "border-neutral-300 border-dashed bg-neutral-50" : "border-neutral-200 bg-white"}`}
      >
        <AvatarImage src={member?.avatar_url} alt={member?.full_name ?? undefined} />
        <AvatarFallback
          className={`font-semibold text-sm ${isPlaceholder ? "bg-neutral-50 text-neutral-400" : "bg-neutral-100 text-neutral-600"}`}
        >
          {initials}
        </AvatarFallback>
      </Avatar>
      <div className="flex min-w-0 flex-1 items-center">
        <span
          className={`wrap-break-word font-medium text-sm leading-snug ${isPlaceholder ? "text-neutral-500" : "text-neutral-900"}`}
        >
          {name}
        </span>
      </div>
    </li>
  );
}
