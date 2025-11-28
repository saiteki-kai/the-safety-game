export class TeamNotFoundError extends Error {
  constructor(message = "Codice team non valido.") {
    super(message);
    this.name = "TeamNotFoundError";
  }
}

export class TeamNameExistsError extends Error {
  constructor(message = "Esiste già un team con questo nome.") {
    super(message);
    this.name = "TeamNameExistsError";
  }
}

export class TeamFullError extends Error {
  constructor(message = "Il team ha raggiunto il numero massimo di membri.") {
    super(message);
    this.name = "TeamFullError";
  }
}

export class TeamCreationError extends Error {
  constructor(message = "Si è verificato un errore durante la creazione del team.") {
    super(message);
    this.name = "TeamCreationError";
  }
}

export class TeamJoinError extends Error {
  constructor(message = "Si è verificato un errore durante l'accesso al team.") {
    super(message);
    this.name = "TeamJoinError";
  }
}

export class UnauthorizedError extends Error {
  constructor(message = "Utente non autorizzato.") {
    super(message);
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
