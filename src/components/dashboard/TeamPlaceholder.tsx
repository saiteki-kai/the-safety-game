import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@components/ui/card";
import { CircleCheck, ClipboardList, Rocket, Users } from "lucide-react";

export default function TeamPlaceholder({ teamName }: { teamName: string }) {
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
