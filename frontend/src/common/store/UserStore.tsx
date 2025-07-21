import { create } from "zustand";

interface User {
  id: number;
  email: string;
  phone_number: string;
  first_name: string;
  last_name: string;
  is_clinic_manager: boolean;
  is_doctor: boolean;
  is_patient: boolean;
  is_research_patient: boolean;
  clinicId: number;
  clinicName: string;
  last_login: string | null;
  is_superuser: boolean;
  is_staff: boolean;
  is_active: boolean;
  date_joined: string;
  groups: any[];
  user_permissions: any[];
  modules: any[];
  research_patient: boolean;
  status: string;
  server_url: string;
}

interface UserState {
  user: User | null;
  actions: {
    setUser: (user: User | null) => void;
    clearUser: () => void;
  };
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  actions: {
    setUser: (user) => {
      set({ user });
      // Persist user data to localStorage
      if (user) {
        localStorage.setItem('userData', JSON.stringify(user));
      } else {
        localStorage.removeItem('userData');
      }
    },
    clearUser: () => {
      set({ user: null });
      // Clear persisted data
      localStorage.removeItem('userData');
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
    },
  },
}));

export const useUser = () => {
  return useUserStore((state) => state.user);
};

export const useUserActions = () => {
  return useUserStore((state) => state.actions);
};

// Get user's full name
export const useUserFullName = () => {
  const user = useUser();
  if (!user) return null;
  return `${user.first_name} ${user.last_name}`.trim();
};

// Get user's clinic name
export const useClinicName = () => {
  const user = useUser();
  return user?.clinicName || 'Generic3';
};

// Check if the user is authenticated
export const useIsAuthenticated = () => {
  const user = useUser();
  return user !== null;
};
