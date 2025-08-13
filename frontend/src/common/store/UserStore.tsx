import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { IAuthUser } from "../types/User";

interface UserState {
  user: IAuthUser | null;
  actions: {
    setUser: (user: IAuthUser) => void;
    logout: () => void;
  };
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      actions: {
        setUser: (user) => {
          set({ user });
        },
        logout: () => {
          set({ user: null });
        },
      },
    }),
    {
      name: "user-storage",
      partialize: (state) => state.user,
    }
  )
);

export const useIsAuthenticated = () => {
  return useUserStore((state) => state.user);
};
