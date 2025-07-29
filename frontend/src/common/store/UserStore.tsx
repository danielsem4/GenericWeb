import { create } from "zustand";
import type { IUserResponse } from "../types/User";
import { useLocation } from "react-router";

interface UserState {
  user: IUserResponse | null;
  actions: {
    setUser: (user: IUserResponse | null) => void;
    logout: () => void;
  };
}

export const useUserStore = create<UserState>()(
    (set) => ({
      user: null,
      actions: {
        setUser: (user) => set({ user }),
        logout: () => {
          set({ user: null })
          localStorage.removeItem("auth_token");
        },
      },
    }),
);

export const useUser = () => {
  return useUserStore((state) => state.user);
};

export const useUserActions = () => {
  return useUserStore((state) => state.actions);
};

export const useIsAuthenticated = () => {
  const token = localStorage.getItem("auth_token");
  return token
};
