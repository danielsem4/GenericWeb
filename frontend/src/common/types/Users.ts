export interface IUser {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  role: string;
  patient_modules: IUserModule[] | null;
}

export interface IUserModule {
  module_name: string;
  module_id: number;
  module_description: string;
  is_active: "active" | "inactive";
}
