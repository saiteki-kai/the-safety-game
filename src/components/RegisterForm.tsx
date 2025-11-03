import type { ChangeEvent, FormEvent } from "react";
import { useState } from "react";

const MODE_INDIVIDUAL = "individual" as const;
const MODE_TEAM = "team" as const;

type Mode = typeof MODE_INDIVIDUAL | typeof MODE_TEAM;

type StatusType = "error" | "success" | null;

interface IndividualState {
	firstName: string;
	lastName: string;
	email: string;
}

interface TeamMember {
	firstName: string;
	lastName: string;
}

interface TeamState {
	teamName: string;
	contactEmail: string;
	members: TeamMember[];
}

interface Status {
	type: StatusType;
	message: string;
}

interface RegisterResponse {
	message?: string;
}

const buildMember = (): TeamMember => ({ firstName: "", lastName: "" });

const createEmptyIndividualState = (): IndividualState => ({ firstName: "", lastName: "", email: "" });

const createEmptyTeamState = (): TeamState => ({
	teamName: "",
	contactEmail: "",
	members: [buildMember(), buildMember()],
});

const createEmptyStatus = (): Status => ({ type: null, message: "" });

const sanitizeMember = (member: TeamMember): TeamMember => ({
	firstName: member.firstName.trim(),
	lastName: member.lastName.trim(),
});

export default function RegisterForm() {
	const [mode, setMode] = useState<Mode>(MODE_INDIVIDUAL);
	const [individual, setIndividual] = useState<IndividualState>(createEmptyIndividualState);
	const [team, setTeam] = useState<TeamState>(createEmptyTeamState);
	const [status, setStatus] = useState<Status>(createEmptyStatus);
	const [submitting, setSubmitting] = useState(false);

	const memberCount = team.members.length;
	const memberLimitReached = memberCount >= 4;
	const memberLimitFallen = memberCount <= 2;
	const isTeamMode = mode === MODE_TEAM;

	const resetStatus = () => setStatus(createEmptyStatus());

	const handleModeChange = (nextMode: Mode) => {
		if (nextMode === mode) return;
		setMode(nextMode);
		resetStatus();
	};

	const handleIndividualChange = (key: keyof IndividualState, value: string) => {
		setIndividual((prev) => ({ ...prev, [key]: value }));
	};

	const handleTeamFieldChange = (key: "teamName" | "contactEmail", value: string) => {
		setTeam((prev) => ({ ...prev, [key]: value }));
	};

	const handleMemberChange = (index: number, key: keyof TeamMember, value: string) => {
		setTeam((prev) => {
			const nextMembers = prev.members.map((member, memberIndex) =>
				memberIndex === index ? { ...member, [key]: value } : member,
			);
			return { ...prev, members: nextMembers };
		});
	};

	const handleAddMember = () => {
		if (memberLimitReached) return;
		setTeam((prev) => ({ ...prev, members: [...prev.members, buildMember()] }));
	};

	const handleRemoveMember = () => {
		if (memberLimitFallen) return;
		setTeam((prev) => ({ ...prev, members: prev.members.slice(0, -1) }));
	};

	const validate = (): string | null => {
		if (!isTeamMode) {
			const firstName = individual.firstName.trim();
			const lastName = individual.lastName.trim();
			const email = individual.email.trim();

			if (!firstName || !lastName || !email) {
				return "Per l'iscrizione individuale sono richiesti nome, cognome ed email.";
			}

			return null;
		}

		const teamName = team.teamName.trim();
		const contactEmail = team.contactEmail.trim();
		const validMembers = team.members.map(sanitizeMember).filter((member) => member.firstName && member.lastName);

		if (!teamName || !contactEmail) {
			return "Per l'iscrizione del team sono richiesti nome team ed email di contatto.";
		}

		if (validMembers.length !== team.members.length) {
			return "Ogni membro del team deve avere nome e cognome.";
		}

		if (validMembers.length < 2 || validMembers.length > 4) {
			return "Un team deve avere da 2 a 4 membri.";
		}

		return null;
	};

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		resetStatus();

		const validationError = validate();
		if (validationError) {
			setStatus({ type: "error", message: validationError });
			return;
		}

		setSubmitting(true);
		try {
			const trimmedIndividual: IndividualState = {
				firstName: individual.firstName.trim(),
				lastName: individual.lastName.trim(),
				email: individual.email.trim(),
			};

			const trimmedTeam: TeamState = {
				teamName: team.teamName.trim(),
				contactEmail: team.contactEmail.trim(),
				members: team.members.map(sanitizeMember),
			};

			type IndividualPayload = {
				mode: typeof MODE_INDIVIDUAL;
			} & IndividualState;

			type TeamPayload = {
				mode: typeof MODE_TEAM;
			} & Omit<TeamState, "members"> & { members: TeamMember[] };

			const payload: IndividualPayload | TeamPayload = isTeamMode
				? {
						mode,
						teamName: trimmedTeam.teamName,
						contactEmail: trimmedTeam.contactEmail,
						members: trimmedTeam.members,
					}
				: {
						mode,
						firstName: trimmedIndividual.firstName,
						lastName: trimmedIndividual.lastName,
						email: trimmedIndividual.email,
					};

			const response = await fetch("/api/register", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(payload),
			});

			const responseBody = (await response.json().catch(() => null)) as RegisterResponse | null;

			if (!response.ok) {
				const message = responseBody?.message ?? "Registrazione non riuscita. Riprova.";
				setStatus({ type: "error", message });
				return;
			}

			const message = responseBody?.message ?? "Iscrizione completata!";
			setStatus({ type: "success", message });
			setIndividual(createEmptyIndividualState());
			setTeam(createEmptyTeamState());
		} catch (error) {
			console.error("Registration error", error);
			setStatus({ type: "error", message: "Si è verificato un errore imprevisto." });
		} finally {
			setSubmitting(false);
		}
	};

	const handleInputChange = (handler: (value: string) => void) => (event: ChangeEvent<HTMLInputElement>) =>
		handler(event.target.value);

	const radioChangeHandler = (nextMode: Mode) => () => handleModeChange(nextMode);

	const renderTeamMembers = () =>
		team.members.map((member, index) => (
			<div key={`member-${index}`} className="member-row">
				<label>
					Nome
					<input
						type="text"
						value={member.firstName}
						onChange={handleInputChange((value) => handleMemberChange(index, "firstName", value))}
						required
					/>
				</label>
				<label>
					Cognome
					<input
						type="text"
						value={member.lastName}
						onChange={handleInputChange((value) => handleMemberChange(index, "lastName", value))}
						required
					/>
				</label>
			</div>
		));

	return (
		<form onSubmit={handleSubmit} className="register-form">
			<fieldset className="register-toggle">
				<legend>Tipo di iscrizione</legend>
				<div>
					<label>
						<input
							type="radio"
							name="registration-mode"
							value={MODE_INDIVIDUAL}
							checked={mode === MODE_INDIVIDUAL}
							onChange={radioChangeHandler(MODE_INDIVIDUAL)}
						/>
						Individuo
					</label>
					<label>
						<input
							type="radio"
							name="registration-mode"
							value={MODE_TEAM}
							checked={mode === MODE_TEAM}
							onChange={radioChangeHandler(MODE_TEAM)}
						/>
						Team
					</label>
				</div>
			</fieldset>

			{!isTeamMode ? (
				<section className="register-section">
					<h2>Dati partecipante</h2>
					<label>
						Nome
						<input
							type="text"
							value={individual.firstName}
							onChange={handleInputChange((value) => handleIndividualChange("firstName", value))}
							required
						/>
					</label>
					<label>
						Cognome
						<input
							type="text"
							value={individual.lastName}
							onChange={handleInputChange((value) => handleIndividualChange("lastName", value))}
							required
						/>
					</label>
					<label>
						Email
						<input
							type="email"
							value={individual.email}
							onChange={handleInputChange((value) => handleIndividualChange("email", value))}
							required
						/>
					</label>
				</section>
			) : (
				<section className="register-section">
					<h2>Dati del team</h2>
					<label>
						Nome del team
						<input
							type="text"
							value={team.teamName}
							onChange={handleInputChange((value) => handleTeamFieldChange("teamName", value))}
							required
						/>
					</label>
					<label>
						Email di contatto
						<input
							type="email"
							value={team.contactEmail}
							onChange={handleInputChange((value) => handleTeamFieldChange("contactEmail", value))}
							required
						/>
					</label>

					<div className="register-members">
						<div className="members-header">
							<h3>Membri del team</h3>
							<div className="member-actions">
								<button type="button" onClick={handleAddMember} disabled={memberLimitReached}>
									Aggiungi membro
								</button>
								<button type="button" onClick={handleRemoveMember} disabled={memberLimitFallen}>
									Rimuovi membro
								</button>
							</div>
						</div>

						{renderTeamMembers()}
					</div>
				</section>
			)}

			{status.message && (
				<p className={`register-status ${status.type === "error" ? "status-error" : "status-success"}`}>
					{status.message}
				</p>
			)}

			<button type="submit" disabled={submitting}>
				{submitting ? "Invio..." : "Invia iscrizione"}
			</button>
		</form>
	);
}
