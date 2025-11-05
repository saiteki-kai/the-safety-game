import { Button } from "@components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@components/ui/card";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import { CircleCheck, ClipboardList, KeyRound, Puzzle, Rocket, Users } from "lucide-react";
import { useState } from "react";

type TeamShape = {
  name?: string;
};

type UserShape = {
  name: string;
  email: string;
};

type DashboardClientProps = {
  team?: TeamShape | null;
  user?: UserShape | null;
};

const FALLBACK_USER: UserShape = {
  name: "Alex Johnson",
  email: "student@university.edu",
};

type TabKey = "create" | "join";

const TAB_COPY: Record<TabKey, { tab: string; title: string; description: string }> = {
  create: {
    tab: "Crea team",
    title: "Crea il tuo team",
    description: "Avvia un nuovo team e invita i tuoi compagni.",
  },
  join: {
    tab: "Unisciti al team",
    title: "Unisciti a un team",
    description: "Inserisci il codice condiviso dai tuoi compagni per entrare nel loro gruppo.",
  },
};

function CreateTeamForm() {
  return (
    <form className="space-y-6" onSubmit={(event) => event.preventDefault()}>
      <div className="space-y-2">
        <Label htmlFor="team-name" className="font-semibold text-neutral-900 text-sm">
          Nome del team *
        </Label>
        <Input
          id="team-name"
          name="teamName"
          placeholder="es. Safety Guardians"
          required
          className="h-12 rounded-xl border border-neutral-200 bg-neutral-50 text-base text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-900 focus:ring-neutral-900/15"
        />
        <p className="text-neutral-500 text-xs">
          Scegli un nome riconoscibile così i compagni ti trovano più facilmente.
        </p>
      </div>

      <Button
        type="submit"
        className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-neutral-900 font-semibold text-base text-white transition hover:bg-neutral-800 focus-visible:ring-neutral-900/40"
      >
        <Rocket className="h-4 w-4" aria-hidden="true" />
        Crea
      </Button>
    </form>
  );
}

function JoinTeamForm() {
  return (
    <form className="space-y-6" onSubmit={(event) => event.preventDefault()}>
      <div className="space-y-2">
        <Label htmlFor="team-code" className="font-semibold text-neutral-900 text-sm">
          Codice team *
        </Label>
        <div className="relative">
          <KeyRound
            className="-translate-y-1/2 pointer-events-none absolute top-1/2 left-4 h-4 w-4 text-neutral-400"
            aria-hidden="true"
          />
          <Input
            id="team-code"
            name="teamCode"
            placeholder="es. ABC123"
            className="h-12 rounded-xl border border-neutral-200 bg-neutral-50 pl-11 text-base text-neutral-900 uppercase tracking-[0.3em] placeholder:tracking-normal focus:border-neutral-900 focus:ring-neutral-900/15"
            required
          />
        </div>
        <p className="text-neutral-500 text-xs">Inserisci il codice di 6 caratteri condiviso dal tuo team leader.</p>
      </div>

      <Button
        type="submit"
        className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-neutral-900 font-semibold text-base text-white transition hover:bg-neutral-800 focus-visible:ring-neutral-900/40"
      >
        <Puzzle className="h-4 w-4" aria-hidden="true" />
        Unisciti
      </Button>
    </form>
  );
}

function TeamPlaceholder({ teamName }: { teamName: string }) {
  return (
    <div className="space-y-6">
      <Card className="rounded-[28px] border border-white/60 bg-white/95 p-0 shadow-xl">
        <CardHeader className="space-y-3 px-8 pt-8">
          <CardTitle className="flex items-center gap-3 text-2xl text-neutral-900">
            <Rocket className="h-6 w-6 text-neutral-500" aria-hidden="true" />
            Benvenuto, {teamName}
          </CardTitle>
          <CardDescription className="text-base text-neutral-600">
            Questa area mostrerà progressi, scadenze e submission del tuo team quando collegheremo i dati reali.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 px-8 pb-8 md:grid-cols-2">
          <div className="rounded-2xl border border-neutral-200 border-dashed bg-neutral-50 p-5">
            <div className="flex items-center gap-2 text-neutral-900">
              <Users className="h-5 w-5 text-neutral-500" aria-hidden="true" />
              <p className="font-semibold">Membri del team</p>
            </div>
            <p className="mt-2 text-neutral-600 text-sm">
              Visualizza i profili dei membri, i ruoli e i contatti per coordinare le attività.
            </p>
          </div>

          <div className="rounded-2xl border border-neutral-200 border-dashed bg-neutral-50 p-5">
            <div className="flex items-center gap-2 text-neutral-900">
              <ClipboardList className="h-5 w-5 text-neutral-500" aria-hidden="true" />
              <p className="font-semibold">Prossimi passi</p>
            </div>
            <p className="mt-2 text-neutral-600 text-sm">
              Timeline, checkpoint e suggerimenti pratici per completare le challenge saranno disponibili qui.
            </p>
          </div>

          <div className="rounded-2xl border border-neutral-200 border-dashed bg-neutral-50 p-5 md:col-span-2">
            <div className="flex items-center gap-2 text-neutral-900">
              <CircleCheck className="h-5 w-5 text-neutral-500" aria-hidden="true" />
              <p className="font-semibold">Submission del progetto</p>
            </div>
            <p className="mt-2 text-neutral-600 text-sm">
              Troverai le bozze, gli invii finali e gli stati di revisione del tuo progetto in questa sezione.
            </p>
          </div>
        </CardContent>
        <CardFooter className="justify-center pb-8">
          <p className="rounded-full bg-neutral-100 px-4 py-2 font-medium text-neutral-500 text-xs">
            Integriamo Supabase per popolare questi dati al prossimo sprint.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}

export default function DashboardClient({ team, user }: DashboardClientProps) {
  const activeUser = user ?? FALLBACK_USER;
  const hasTeam = Boolean(team);
  const [tab, setTab] = useState<TabKey>("create");

  const copy = TAB_COPY[tab];

  return (
    <section className="bg-[linear-gradient(to_bottom_right,#f3f6ff,white,#f9f3ff)]">
      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        {hasTeam ? (
          <div className="space-y-10">
            <header className="space-y-2 text-center sm:text-left">
              <p className="font-medium text-neutral-500 text-sm">Bentornato, {activeUser.name}</p>
              <h1 className="font-semibold text-3xl text-neutral-900">Dashboard del team</h1>
              <p className="text-base text-neutral-600">
                Stiamo preparando gli strumenti per il tuo team. A breve vedrai qui progressi e aggiornamenti.
              </p>
            </header>
            <TeamPlaceholder teamName={team?.name ?? "Il tuo team"} />
          </div>
        ) : (
          <div className="flex min-h-[70vh] flex-col items-center justify-center">
            <div className="text-center">
              <p className="font-medium text-neutral-500 text-sm">Ciao {activeUser.name} 👋</p>
              <h1 className="mt-2 font-semibold text-3xl text-neutral-900">Gestisci il tuo team</h1>
              <p className="mt-2 text-base text-neutral-600">
                Crea un nuovo gruppo o unisciti a un team già esistente utilizzando il codice di invito.
              </p>
            </div>

            <div className="mt-10 flex w-full max-w-sm justify-center">
              <div className="flex w-full rounded-full border border-white/70 bg-white/80 p-1 shadow-[0px_12px_40px_rgba(15,23,42,0.08)] backdrop-blur">
                {(Object.keys(TAB_COPY) as TabKey[]).map((key) => {
                  const isActive = tab === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setTab(key)}
                      className={`flex-1 rounded-full px-4 py-2 font-semibold text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900/30 ${
                        isActive ? "bg-[#0f1020] text-white shadow" : "text-neutral-500 hover:text-neutral-800"
                      }`}
                      aria-pressed={isActive}
                    >
                      {TAB_COPY[key].tab}
                    </button>
                  );
                })}
              </div>
            </div>

            <Card className="mt-10 w-full max-w-2xl rounded-[32px] border border-white/80 bg-white/95 p-0 shadow-2xl">
              <CardHeader className="space-y-3 px-8 pt-8">
                <CardTitle className="font-semibold text-2xl text-neutral-900">{copy.title}</CardTitle>
                <CardDescription className="text-base text-neutral-600">{copy.description}</CardDescription>
              </CardHeader>
              <CardContent className="px-8 pb-10">
                {tab === "create" ? <CreateTeamForm /> : <JoinTeamForm />}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </section>
  );
}
