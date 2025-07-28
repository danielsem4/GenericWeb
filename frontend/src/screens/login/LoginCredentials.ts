import type { IUser } from "@/common/types/User";

export interface LoginCredentials {
    email: string;
    password: string;
  }
  
export interface LoginResponse {
    user: IUser;
    token: string;
  }