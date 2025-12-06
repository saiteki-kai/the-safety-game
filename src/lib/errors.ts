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

export default {
  TeamNotFoundError,
  TeamNameExistsError,
  TeamFullError,
  TeamCreationError,
  TeamJoinError,
  UnauthorizedError,
};
