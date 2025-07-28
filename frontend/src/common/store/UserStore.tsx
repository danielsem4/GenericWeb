import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { IUser, IUserResponse } from "../types/User";


interface UserState {
  user: IUserResponse | null;
  actions: {
    setUser: (user: IUserResponse | null) => void;
    logout: () => void;
  };
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      actions: {
        setUser: (user) => set({ user }),
        logout: () => set({ user: null }),
      },
    }),
    {
      name: "user-storage",
      partialize: (state) => ({ user: state.user }),
    }
  )
);

export const useUser = () => {
  return useUserStore((state) => state.user);
};

export const useUserActions = () => {
  return useUserStore((state) => state.actions);
};

export const useIsAuthenticated = () => {
  const user = useUser();
  return user !== null && user.token !== "";
};
