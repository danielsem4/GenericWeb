import type { IModule } from "./User";

export interface IUser {
    id: number;
    name: string;
    email: string;
    role: string;
    status: "Active" | "Inactive" | "Pending";
    department: string;
    joinDate: string;
    lastLogin: string;
    activeModules: IModule[]
  }