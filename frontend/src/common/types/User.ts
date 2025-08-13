export interface IAuthUser {
  id: string;
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
  isClinicManager: boolean;
  isDoctor: boolean;
  isPatient: boolean;
  isResearchPatient: boolean;
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
