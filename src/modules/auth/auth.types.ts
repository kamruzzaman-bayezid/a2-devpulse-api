export type TUserRole = "contributor" | "maintainer";
// auth.types.ts
export interface IRegisterInput {
  name: string;
  email: string;
  password: string;
  role: TUserRole;
}

export interface ILoginInput {
  email: string;
  password: string;
}

export interface IUserResponse {
  id: number;
  name: string;
  email: string;
  role: TUserRole;
  created_at: Date;
  updated_at: Date;
}
