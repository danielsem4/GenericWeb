import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { IAuthUser, IAuthUserResponse } from "../types/User";
import axios from "axios";

interface UserState {
  user: IAuthUser | null;
  token: string | null;
  actions: {
    setUser: (user: IAuthUser, token: string) => void;
    logout: () => void;
    hydrate: () => void;
  };
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      actions: {
        setUser: (user, token) => {
          set({ user, token });
        },
        logout: () => {
          set({ user: null, token: null });
          localStorage.removeItem("auth_token");
        },
        hydrate: async () => {
          const token = localStorage.getItem("auth_token");
          if (token) {
            try {
              const response = await axios.get<IAuthUserResponse>(
                `${import.meta.env.VITE_API_URL}login/`,
                { headers: { Authorization: `Bearer ${token}` } }
              );
              set({ user: response.data.user, token });
            } catch {
              localStorage.removeItem("auth_token");
            }
          }
        },
      },
    }),
    {
      name: "user-storage",
      partialize: (state) => ({ user: state.user, token: state.token }),
    }
  )
);

export const useIsAuthenticated = () => {
  return useUserStore((state) => !!state.token);
};