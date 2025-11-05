import "@styles/dashboard.css";

import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { Rocket, Users } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const TEAM_NAME_HINT = "Scegli un nome riconoscibile così i compagni ti trovano più facilmente.";
const TEAM_NAME_ERROR = "Il nome del team deve contenere almeno 3 caratteri.";

const createTeamSchema = z.object({
  name: z.string().trim().min(3, { message: TEAM_NAME_ERROR }),
});

type CreateTeamFormValues = z.infer<typeof createTeamSchema>;

export default function CreateTeamForm({ onCreate }: { onCreate: (name: string) => void }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<CreateTeamFormValues>({
    resolver: zodResolver(createTeamSchema),
    defaultValues: { name: "" },
    mode: "onChange",
  });

  const onSubmit = (values: CreateTeamFormValues) => {
    onCreate(values.name);
    reset();
  };

  const nameError = errors.name?.message ?? null;
  const inputStateClass = nameError ? "dashboard-input-error" : "dashboard-input-default";
  const helperTextClass = `dashboard-helper-text${nameError ? " dashboard-helper-text-error" : ""}`;

  return (
    <form className="dashboard-form" onSubmit={handleSubmit(onSubmit)}>
      <div className="dashboard-field">
        <Label htmlFor="team-name" className="dashboard-field-label">
          Nome del team *
        </Label>
        <div className="dashboard-input-wrapper">
          <Users className="dashboard-input-icon" aria-hidden="true" />
          <Input
            id="team-name"
            placeholder="es. Safety Guardians"
            required
            aria-invalid={nameError ? "true" : "false"}
            className={`dashboard-input ${inputStateClass}`}
            {...register("name")}
          />
        </div>
        <p aria-live="polite" className={helperTextClass}>
          {nameError ? nameError : TEAM_NAME_HINT}
        </p>
      </div>

      <Button type="submit" disabled={!isValid} className="dashboard-submit">
        <Rocket className="h-4 w-4" aria-hidden="true" />
        Crea
      </Button>
    </form>
  );
}
