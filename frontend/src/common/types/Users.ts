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

  export interface IUser1 {
    email: string;
    first_name: string;
    last_name: string;
    phone_number: string;
    is_clinic_manager: boolean;
    is_doctor: boolean;
    is_patient: boolean;
    is_research_patient: boolean;
  }