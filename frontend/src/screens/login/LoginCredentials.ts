import type { IAuthUser } from "@/common/types/User";

export interface LoginCredentials {
    email: string;
    password: string;
  }
  
export interface LoginResponse {
    user: IAuthUser;
  }