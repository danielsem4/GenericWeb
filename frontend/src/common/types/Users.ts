import type { IModule } from "./User";

export interface IUser {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  role: string;
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

export interface IUserModule {
  moduleName: string;
  module_id: number;
  description: string;
  status: "active" | "inactive";
}
