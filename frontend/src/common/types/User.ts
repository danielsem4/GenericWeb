export interface IAuthUser {
  id: number;
  password: string;
  lastLogin: string | null;
  isSuperuser: boolean;
  username: string;
  isStaff: boolean;
  isActive: boolean;
  dateJoined: string;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  role: string;
  groups: any[];
  userPermissions: any[];
  clinicId: number;
  clinicName: string;
  clinicImage: string;
  modules: IModule[];
  status: string;
  serverUrl: string;
}

export interface IModule {
  id: number;
  name: string;
}
