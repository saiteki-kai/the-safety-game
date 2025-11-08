import type { Database, Enums, Json, Tables } from "./supabase.generated";

type Profile = Tables<"profiles">;
type Team = Tables<"teams">;
type Submission = Tables<"submissions">;
type Leaderboard = Tables<"leaderboard">;
type TeamMembers = Tables<"team_members">;

export type { Database, Profile, Submission, Team, TeamMembers, Leaderboard, Enums, Json };
