import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import type { LoginCredentials, LoginResponse } from "../LoginCredentials";
import { useUserStore } from "@/common/store/UserStore";
import type { IAuthUser } from "@/common/types/User";

async function loginUser(credentials: LoginCredentials): Promise<IAuthUser> {
  const response = await axios.post<IAuthUser>(
    `${import.meta.env.VITE_API_URL_DEV}auth/login/`,
    credentials,
    { withCredentials: true }
  );
  return response.data;
}

export const useLogin = () => {
  const { actions } = useUserStore();

  return useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      actions.setUser(data);
      console.log("Login successful:", data);
    },
    onError: (error) => {
      console.error("Login failed:", error);
    },
  });
};

export const useLogout = () => {
  const { actions } = useUserStore();

  return () => {
    actions.logout();
  };
};
