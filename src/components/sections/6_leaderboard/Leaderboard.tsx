import Icon from "@components/common/Icon";
import IconLabel from "@components/common/IconLabel";
import type { IconName } from "@utils/icons";
import { PostgrestError } from "@supabase/supabase-js";
import { formatDateTime } from "@utils/formatters";
import { useEffect, useEffectEvent, useState } from "react";
import { supabase } from "../../../db/client";

type Team = {
	name: string;
	final_score: number;
	members: Array<string>;
	last_submission: string;
};

async function fetchLeaderboard() {
	const { data, error } = await supabase.from("leaderboard").select();

	if (error) {
		console.error("Error fetching leaderboard:", error);
		throw error;
	}

	return data as Team[];
}

const formatPercent = (v: number) => {
	if (typeof v !== "number" || !Number.isFinite(v)) return "0.00";
	return (v * 100).toFixed(2);
};

const formatDateShortNoYear = (value: string) => {
	try {
		return new Intl.DateTimeFormat("it-IT", {
			day: "2-digit",
			month: "short",
			hour: "2-digit",
			minute: "2-digit",
		}).format(new Date(value));
	} catch (_e) {
		return formatDateTime(value);
	}
};

// highlight configuration for top ranks
const highlightConfig: Record<number, { row: string; icon?: { name: string; class: string } }> = {
	1: { row: "highlight-1", icon: { name: "trophy", class: "text-yellow-500" } },
	2: { row: "highlight-2", icon: { name: "medal", class: "text-gray-400" } },
	3: { row: "highlight-3", icon: { name: "award", class: "text-amber-600" } },
};

export default function Leaderboard({ emptyMessage }: { emptyMessage: string }) {
	const [leaderboard, setLeaderboard] = useState<Team[] | null>(null);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<Error | null>(null);

	const fetchData = useEffectEvent(async () => {
		setLoading(true);
		setError(null);
		try {
			const data = await fetchLeaderboard();
			setLeaderboard(data ?? []);
		} catch (err: unknown) {
			setError(err instanceof PostgrestError ? err : new Error("Unknown error"));
			setLeaderboard([]);
		} finally {
			setLoading(false);
		}
	});

	useEffect(() => {
		fetchData();

		const channel = supabase
			.channel("submissions-changes")
			.on(
				"postgres_changes",
				{
					event: "*",
					schema: "public",
					table: "submissions",
				},
				async (_payload) => fetchData(),
			)
			.subscribe((status) => {
				console.log("Subscription status:", status);
			});

		return () => {
			supabase.removeChannel(channel);
		};
	}, []);

	const isEmpty = !loading && (!leaderboard || leaderboard.length === 0) && !error;

	return (
		<>
			{loading ? (
				// Table-shaped skeleton to reduce layout shift
				<table className="table-base animate-pulse">
					<colgroup>
						<col style={{ width: "5rem" }} />
						<col style={{ width: "6rem" }} />
						<col style={{ width: "5rem" }} />
						<col />
						<col style={{ width: "10rem" }} />
					</colgroup>
					<thead>
						<tr>
							<th className="text-center">Posizione</th>
							<th className="text-center">Punteggio</th>
							<th className="text-center">#Membri</th>
							<th className="text-left">Nome del Team</th>
							<th className="text-right">Ultima Consegna</th>
						</tr>
					</thead>
					<tbody>
						{[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((k) => (
							<tr key={`loading-${k}`} className="h-12">
								<td className="td py-1">
									<div className="h-2 w-12 rounded bg-neutral-200" />
								</td>
								<td className="td py-1">
									<div className="mx-auto h-2 w-16 rounded bg-neutral-200" />
								</td>
								<td className="td py-1">
									<div className="mx-auto h-2 w-6 rounded bg-neutral-200" />
								</td>
								<td className="td py-1">
									<div className="h-2 w-48 rounded bg-neutral-200" />
								</td>
								<td className="td py-1 text-right">
									<div className="ml-auto h-2 w-24 rounded bg-neutral-200" />
								</td>
							</tr>
						))}
					</tbody>
				</table>
			) : error ? (
				<div className="flex h-full items-center justify-center py-6">
					<div className="leaderboard-empty flex-col justify-center text-center">
						<Icon name="triangle-alert" size={28} className="mx-auto text-red-500" />
						<p className="mt-3 text-red-600 text-sm">Impossibile caricare la classifica. Riprova più tardi.</p>
					</div>
				</div>
			) : isEmpty ? (
				<div className="flex h-full items-center justify-center py-6">
					<IconLabel
						name="triangle-alert"
						size={28}
						iconClass="text-neutral-400"
						as="div"
						className="leaderboard-empty flex-col justify-center"
					>
						{emptyMessage}
					</IconLabel>
				</div>
			) : (
				<table className="table-base">
					<colgroup>
						<col style={{ width: "5rem" }} />
						<col style={{ width: "6rem" }} />
						<col style={{ width: "5rem" }} />
						<col />
						<col style={{ width: "10rem" }} />
					</colgroup>
					<thead>
						<tr>
							<th scope="col" className="text-center">
								Posizione
							</th>
							<th scope="col" className="text-center">
								Punteggio
							</th>
							<th scope="col" className="text-center">
								#Membri
							</th>
							<th scope="col" className="text-left">
								Nome del Team
							</th>
							<th scope="col" className="text-right">
								Ultima Consegna
							</th>
						</tr>
					</thead>
					<tbody>
						{leaderboard?.map((team, index) => {
							const rank = index + 1;
							const highlight = highlightConfig[rank];
							const rowClass = `leaderboard-row ${highlight?.row ?? ""} ${team.name === "ChatGPT" ? "chatgpt-row" : ""}`;

							return (
								<tr className={rowClass} key={team.name}>
									<td className="td rank-cell py-1 text-center">
										{highlight?.icon ? (
											<div className="podium-icon">
												<Icon name={highlight.icon.name as IconName} size={20} className={highlight.icon.class} />
											</div>
										) : (
											<div className="podium-icon">{rank}</div>
										)}
									</td>
									<td className="td score-mono py-1 text-center">{formatPercent(team.final_score)}</td>
									<td className="td py-1 text-center">{team.members.length}</td>
									<td className="td team-name py-1 text-left">
										{team.name === "ChatGPT" ? (
											<IconLabel
												name="chatgpt"
												size={16}
												iconClass="m-auto ml-1"
												as="span"
												position="end"
												className="inline-flex items-center font-semibold text-emerald-500"
											>
												{team.name}
											</IconLabel>
										) : (
											team.name
										)}
									</td>
									<td className="td py-1 text-right">
										<time dateTime={team.last_submission}>{formatDateShortNoYear(team.last_submission)}</time>
									</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			)}
		</>
	);
}
