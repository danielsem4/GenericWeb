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
  name: string;
  id: number;
  description: string;
  active: boolean;
}
