import { useMutation, useQueries, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useUserActions } from "../../../common/store/UserStore";
import type { LoginCredentials, LoginResponse } from "../LoginCredentials";

async function loginUser(
  credentials: LoginCredentials
): Promise<LoginResponse> {
  try {
    const response = await axios.post<LoginResponse>(
      `${import.meta.env.VITE_API_URL}login/`,
      credentials
    );

    const data = response.data;
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || error.message;
      throw new Error(`Login failed: ${errorMessage}`);
    }
    throw new Error("An unexpected error occurred during login");
  }
}

export const useLogin = () => {
  const { setUser } = useUserActions();

  const mutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      setUser({
        user: {
          ...data.user
        },
        token: data.token,
      });
    },
    onError: (error) => {
      console.error("Login failed:", error);
    },
  });

  return mutation;
};

export const logOut = () => {
  const { setUser } = useUserActions();
  setUser(null);
};
