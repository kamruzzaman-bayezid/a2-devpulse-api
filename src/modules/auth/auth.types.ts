// auth.types.ts
export interface IRegisterInput {
  name: string;
  email: string;
  password: string;
  role: "contributor" | "maintainer";
}

export interface ILoginInput {
  email: string;
  password: string;
}

export interface IUserResponse {
  id: number;
  name: string;
  email: string;
  role: "contributor" | "maintainer";
  created_at: Date;
  updated_at: Date;
}

export type TUserRole = "contributor" | "maintainer";
