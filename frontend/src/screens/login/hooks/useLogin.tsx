import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import type { LoginCredentials, LoginResponse } from "../LoginCredentials";
import { useUserStore } from "@/common/store/UserStore";

async function loginUser(credentials: LoginCredentials): Promise<LoginResponse> {
  const response = await axios.post<LoginResponse>(
    `${import.meta.env.VITE_API_URL}login/`,
    credentials
  );
  return response.data;
}

export const useLogin = () => {
  const { actions } = useUserStore();
  
  return useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      
      actions.setUser(data.user, data.token);
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