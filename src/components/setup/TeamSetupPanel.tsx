import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/ui/card";
import { useState } from "react";

import CreateTeamForm from "./CreateTeamForm";
import JoinTeamForm from "./JoinTeamForm";

type TabKey = "create" | "join";

type TabCopy = {
  tab: string;
  title: string;
  description: string;
};

const TAB_COPY: Record<TabKey, TabCopy> = {
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

export default function TeamSetupPanel() {
  const [tab, setTab] = useState<TabKey>("create");
  const copy = TAB_COPY[tab];

  return (
    <div className="dashboard-empty-state h-screen">
      <div className="dashboard-empty-heading">
        <h1 className="dashboard-empty-title">Gestisci il tuo team</h1>
        <p className="dashboard-empty-description">
          Crea un nuovo gruppo o unisciti a un team già esistente utilizzando il codice di invito.
        </p>
      </div>

      <div className="dashboard-tabs-shell">
        <div className="dashboard-tabs">
          {(["create", "join"] as TabKey[]).map((key) => {
            const isActive = tab === key;

            return (
              <button
                key={key}
                type="button"
                onClick={() => setTab(key)}
                className={`dashboard-tab cursor-pointer ${isActive ? "dashboard-tab--active" : "dashboard-tab--inactive"}`}
                aria-pressed={isActive}
              >
                {TAB_COPY[key].tab}
              </button>
            );
          })}
        </div>
      </div>

      <Card className="dashboard-card">
        <CardHeader className="dashboard-card-header">
          <CardTitle className="dashboard-card-title">{copy.title}</CardTitle>
          <CardDescription className="dashboard-card-description">{copy.description}</CardDescription>
        </CardHeader>
        <CardContent className="dashboard-card-content">
          {tab === "create" ? <CreateTeamForm /> : <JoinTeamForm />}
        </CardContent>
      </Card>
    </div>
  );
}
