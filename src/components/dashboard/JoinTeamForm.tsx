import "@styles/dashboard.css";

import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { KeyRound, Puzzle } from "lucide-react";
import { type ChangeEvent, useCallback } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const JOIN_CODE_HINT = "Inserisci il codice di 6 caratteri condiviso dal tuo team leader.";
const JOIN_CODE_ERROR = "Il codice deve essere esattamente di 6 caratteri alfanumerici.";

const joinTeamSchema = z.object({
  code: z
    .string()
    .trim()
    .length(6, { message: JOIN_CODE_ERROR })
    .regex(/^[A-Za-z0-9]+$/, { message: JOIN_CODE_ERROR })
    .transform((value) => value.toUpperCase()),
});

type JoinTeamFormValues = z.infer<typeof joinTeamSchema>;

const sanitizeCode = (value: string) =>
  value
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, "")
    .slice(0, 6);

export default function JoinTeamForm({ onJoin }: { onJoin: (code: string) => void }) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isValid },
  } = useForm<JoinTeamFormValues>({
    resolver: zodResolver(joinTeamSchema),
    defaultValues: { code: "" },
    mode: "onChange",
  });

  const codeValue = watch("code") ?? "";
  const codeField = register("code");
  const codeError = errors.code?.message ?? null;
  const inputStateClass = codeError ? "dashboard-input-error" : "dashboard-input-default";
  const helperTextClass = `dashboard-helper-text${codeError ? " dashboard-helper-text-error" : ""}`;

  const handleCodeChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const sanitized = sanitizeCode(event.currentTarget.value);
      event.currentTarget.value = sanitized;
      setValue("code", sanitized, { shouldValidate: true, shouldDirty: true });
      codeField.onChange(event);
    },
    [codeField, setValue],
  );

  const onSubmit = (values: JoinTeamFormValues) => {
    onJoin(values.code);
    reset();
  };

  return (
    <form className="dashboard-form" onSubmit={handleSubmit(onSubmit)}>
      <div className="dashboard-field">
        <Label htmlFor="team-code" className="dashboard-field-label">
          Codice team *
        </Label>
        <div className="dashboard-input-wrapper">
          <KeyRound className="dashboard-input-icon" aria-hidden="true" />
          <Input
            id="team-code"
            placeholder="S 5 G 7 K 2"
            maxLength={6}
            required
            name={codeField.name}
            ref={codeField.ref}
            onBlur={codeField.onBlur}
            value={codeValue}
            onChange={handleCodeChange}
            className={`dashboard-input dashboard-input-code ${inputStateClass}`}
            aria-invalid={codeError ? "true" : "false"}
          />
        </div>
        <p aria-live="polite" className={helperTextClass}>
          {codeError ? codeError : JOIN_CODE_HINT}
        </p>
      </div>

      <Button type="submit" disabled={!isValid} className="dashboard-submit">
        <Puzzle className="h-4 w-4" aria-hidden="true" />
        Unisciti
      </Button>
    </form>
  );
}
