import { create } from "zustand";

interface User {
  id: number;
  email: string;
  name: string;
  token: string;
}

interface UserState {
  user: User | null;
  actions: {
    setUser: (user: User | null) => void;
  };
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  actions: {
    setUser: (user) => set({ user }),
  },
}));
export const useUser = () => {
  return useUserStore((state) => state.user);
};
export const useUserActions = () => {
  return useUserStore((state) => state.actions);
};
// Todo: Add a hook to check if the user is authenticated
export const useIsAuthenticated = () => {
  const user = useUser();
  return user !== null;
};
