import "@styles/dashboard.css";

import TeamPlaceholder from "./TeamPlaceholder";

type TeamDashboardViewProps = {
  teamName?: string | null;
};

export default function TeamDashboardView({ teamName }: TeamDashboardViewProps) {
  const resolvedTeamName = teamName && teamName.trim().length > 0 ? teamName : "Il tuo team";

  return (
    <div className="dashboard-team-wrapper">
      <header className="dashboard-team-header">
        <h1 className="dashboard-team-title">Dashboard del team</h1>
        <p className="dashboard-team-description">
          Stiamo preparando gli strumenti per il tuo team. A breve vedrai qui progressi e aggiornamenti.
        </p>
      </header>
      <TeamPlaceholder teamName={resolvedTeamName} />
    </div>
  );
}
