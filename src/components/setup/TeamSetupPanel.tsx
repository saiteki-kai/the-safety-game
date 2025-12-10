import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/ui/card";
import { useState } from "react";

import CreateTeamForm from "./CreateTeamForm";
import JoinTeamForm from "./JoinTeamForm";

// TEMPORARY: Hardcoded Italian translations
const IT_SETUP = {
  title: "Gestisci il tuo team",
  description: "Crea un nuovo gruppo o unisciti a un team già esistente utilizzando il codice di invito.",
  createTab: "Crea team",
  joinTab: "Unisciti al team",
  createTitle: "Crea il tuo team",
  createDescription: "Avvia un nuovo team e invita i tuoi compagni.",
  joinTitle: "Unisciti a un team",
  joinDescription: "Inserisci il codice condiviso dai tuoi compagni per entrare nel loro gruppo.",
};

type TabKey = "create" | "join";

export default function TeamSetupPanel() {
  const [tab, setTab] = useState<TabKey>("create");
  // TEMPORARY: Using hardcoded Italian

  const tabCopy = {
    create: {
      tab: IT_SETUP.createTab,
      title: IT_SETUP.createTitle,
      description: IT_SETUP.createDescription,
    },
    join: {
      tab: IT_SETUP.joinTab,
      title: IT_SETUP.joinTitle,
      description: IT_SETUP.joinDescription,
    },
  };

  const copy = tabCopy[tab];

  return (
    <div className="dashboard-empty-state h-screen">
      <div className="dashboard-empty-heading">
        <h1 className="dashboard-empty-title">{IT_SETUP.title}</h1>
        <p className="dashboard-empty-description">{IT_SETUP.description}</p>
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
                {tabCopy[key].tab}
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
