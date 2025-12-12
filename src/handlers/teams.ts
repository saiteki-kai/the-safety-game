import type { SupabaseClient } from "@supabase/supabase-js";
import { MAX_TEAM_SIZE } from "@/content/consts";
import {
  addUserToTeam,
  checkTeamName,
  createTeamWithName,
  findTeamByJoinCode,
  getTeamByUserId,
  getTeamMembers,
} from "@/db/teams";
import { TeamCreationError, TeamFullError, TeamJoinError, TeamNameExistsError, TeamNotFoundError } from "@/lib/errors";
import type { Database, Profile, Team } from "@/lib/supabase.types";

export const getTeamMembersHandler = async (db: SupabaseClient<Database>, teamId: string): Promise<Profile[]> => {
  try {
    return await getTeamMembers(db, teamId);
  } catch (error) {
    console.error("Error fetching team members:", error);
    throw error;
  }
};

export const createTeamHandler = async (
  db: SupabaseClient<Database>,
  teamName: string,
  userId: string,
): Promise<Team> => {
  const teamNameExists = await checkTeamName(db, teamName);

  if (teamNameExists) {
    throw new TeamNameExistsError();
  }

  // Create new team
  const newTeam = await createTeamWithName(db, teamName);

  if (!newTeam) {
    throw new TeamCreationError();
  }

  // Add user to team
  const result = await addUserToTeam(db, userId, newTeam.id);

  if (!result) {
    throw new TeamJoinError();
  }

  return newTeam;
};

export const joinTeamHandler = async (
  db: SupabaseClient<Database>,
  joinCode: string,
  userId: string,
): Promise<Team> => {
  // Find team by join code
  const team = await findTeamByJoinCode(db, joinCode);

  if (!team) {
    throw new TeamNotFoundError();
  }

  // Check if team is full
  if (team.members === MAX_TEAM_SIZE) {
    throw new TeamFullError();
  }

  // Add user to team
  const result = await addUserToTeam(db, userId, team.id);

  if (!result) {
    throw new TeamJoinError();
  }

  return team;
};
