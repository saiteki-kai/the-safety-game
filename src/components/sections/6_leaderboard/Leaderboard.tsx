import Icon from "@components/common/Icon";
import IconLabel from "@components/common/IconLabel";
import type { IconName } from "@content/icons";
import { formatDateTime } from "@utils/formatters";
import { useEffect, useEffectEvent, useState } from "react";
import { supabase } from "../../../db/supabase";

async function fetchLeaderboard() {
	const { data, error } = await supabase.from("leaderboard").select();

	if (error) {
		console.error("Error fetching leaderboard:", error);
		return [];
	}

	return data;
}

const formatPercent = (v: number) => {
	if (typeof v !== "number" || !Number.isFinite(v)) return "0.00";
	return (v * 100).toFixed(2);
};

// format like: 31 ott., 14:32 (day short-month, hour:minute) — no year
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
	const [leaderboard, setLeaderboard] = useState([]);
	const [loading, setLoading] = useState(false);

	const fetchData = useEffectEvent(async () => {
		setLoading(true);
		const data = await fetchLeaderboard();
		setLeaderboard(data);
		setLoading(false);
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

	return (
		<>
			{loading ? (
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
						{leaderboard.map((team, index) => {
							const rank = index + 1;
							const highlight = highlightConfig[rank];
							const rowClass = `leaderboard-row ${highlight?.row ?? ""} ${team.name === "ChatGPT" ? "chatgpt-row" : ""}`;

							return (
								<tr className={rowClass} key={team.name}>
									<td className="td rank-cell text-center">
										{highlight?.icon ? (
											<div className="podium-icon">
												<Icon name={highlight.icon.name as IconName} size={20} className={highlight.icon.class} />
											</div>
										) : (
											<div className="podium-icon">{rank}</div>
										)}
									</td>
									<td className="td score-mono text-center">{formatPercent(team.final_score)}</td>
									<td className="td text-center">{team.members.length}</td>
									<td className="td team-name text-left">
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
									<td className="td text-right">
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
