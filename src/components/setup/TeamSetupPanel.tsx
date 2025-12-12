import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/ui/card";
import { getTranslations, setupTranslations, type Locale, DEFAULT_LOCALE } from "@/lib/translations";
import { useState } from "react";

import CreateTeamForm from "./CreateTeamForm";
import JoinTeamForm from "./JoinTeamForm";

type TabKey = "create" | "join";

interface TeamSetupPanelProps {
  locale?: Locale;
}

export default function TeamSetupPanel({ locale = DEFAULT_LOCALE }: TeamSetupPanelProps) {
  const [tab, setTab] = useState<TabKey>("create");
  const t = getTranslations(setupTranslations, locale);

  const tabCopy = {
    create: {
      tab: t.createTab,
      title: t.createTitle,
      description: t.createDescription,
    },
    join: {
      tab: t.joinTab,
      title: t.joinTitle,
      description: t.joinDescription,
    },
  };

  const copy = tabCopy[tab];

  return (
    <div className="dashboard-empty-state h-dvh">
      <div className="dashboard-empty-heading">
        <h1 className="dashboard-empty-title">{t.title}</h1>
        <p className="dashboard-empty-description">{t.description}</p>
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
          {tab === "create" ? <CreateTeamForm locale={locale} /> : <JoinTeamForm locale={locale} />}
        </CardContent>
      </Card>
    </div>
  );
}
