import i18n from "i18next";


export class TeamNotFoundError extends Error {
  constructor(message = "Team not found") {
    super(message);
    this.name = "TeamNotFoundError";
  }
}

export class TeamNameExistsError extends Error {
  constructor(message = "A team with this name already exists") {
    super(message);
    this.name = "TeamNameExistsError";
  }
}

export class TeamFullError extends Error {
  constructor(message = "Team is full") {
    super(message);
    this.name = "TeamFullError";
  }
}

export class TeamCreationError extends Error {
  constructor(message = "Failed to create team") {
    super(message);
    this.name = "TeamCreationError";
  }
}

export class TeamJoinError extends Error {
  constructor(message = "Failed to join team") {
    super(message);
    this.name = "TeamJoinError";
  }
}

export class UnauthorizedError extends Error {
  constructor(message = "Unauthorized access") {
    super(message);
    this.name = "UnauthorizedError";
  }
}

/**
 * Get localized error message based on error instance type.
 * Use this function when displaying error messages to users.
 */
export function getLocalizedErrorMessage(error: unknown): string {
  if (error instanceof TeamNotFoundError) {
    return i18n.t("teamNotFound", { ns: "errors" });
  }
  if (error instanceof TeamNameExistsError) {
    return i18n.t("teamNameExists", { ns: "errors" });
  }
  if (error instanceof TeamFullError) {
    return i18n.t("teamFull", { ns: "errors" });
  }
  if (error instanceof TeamCreationError) {
    return i18n.t("teamCreation", { ns: "errors" });
  }
  if (error instanceof TeamJoinError) {
    return i18n.t("teamJoin", { ns: "errors" });
  }
  if (error instanceof UnauthorizedError) {
    return i18n.t("unauthorized", { ns: "errors" });
  }
  // Fallback for unknown errors
  return i18n.t("error", { ns: "common" });
}

export default {
  TeamNotFoundError,
  TeamNameExistsError,
  TeamFullError,
  TeamCreationError,
  TeamJoinError,
  UnauthorizedError,
  getLocalizedErrorMessage,
};
