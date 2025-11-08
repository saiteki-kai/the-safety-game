export type TeamShape = {
  id?: string;
  name?: string | null;
  join_code?: string | null;
  members?: string[] | null;
};

export type UserShape = {
  name: string;
  email: string;
};
