import i18n from "i18next";

// Helper to get translated error messages
const getErrorMessages = () => ({
  teamNotFound: i18n.t("errors.teamNotFound", { ns: "errors" }),
  teamNameExists: i18n.t("errors.teamNameExists", { ns: "errors" }),
  teamFull: i18n.t("errors.teamFull", { ns: "errors" }),
  teamCreation: i18n.t("errors.teamCreation", { ns: "errors" }),
  teamJoin: i18n.t("errors.teamJoin", { ns: "errors" }),
  unauthorized: i18n.t("errors.unauthorized", { ns: "errors" }),
});

export class TeamNotFoundError extends Error {
  constructor(message?: string) {
    super(message ?? getErrorMessages().teamNotFound);
    this.name = "TeamNotFoundError";
  }
}

export class TeamNameExistsError extends Error {
  constructor(message?: string) {
    super(message ?? getErrorMessages().teamNameExists);
    this.name = "TeamNameExistsError";
  }
}

export class TeamFullError extends Error {
  constructor(message?: string) {
    super(message ?? getErrorMessages().teamFull);
    this.name = "TeamFullError";
  }
}

export class TeamCreationError extends Error {
  constructor(message?: string) {
    super(message ?? getErrorMessages().teamCreation);
    this.name = "TeamCreationError";
  }
}

export class TeamJoinError extends Error {
  constructor(message?: string) {
    super(message ?? getErrorMessages().teamJoin);
    this.name = "TeamJoinError";
  }
}

export class UnauthorizedError extends Error {
  constructor(message?: string) {
    super(message ?? getErrorMessages().unauthorized);
    this.name = "UnauthorizedError";
  }
}

export default {
  TeamNotFoundError,
  TeamNameExistsError,
  TeamCreationError,
  TeamJoinError,
  UnauthorizedError,
};
