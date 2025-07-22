import { useMutation, useQueries, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useUserActions } from "../../../common/store/UserStore";

interface User {
  id: number;
  password?: string;
  last_login: string | null;
  is_superuser: boolean;
  is_staff: boolean;
  is_active: boolean;
  date_joined: string;
  email: string;
  phone_number: string;
  first_name: string;
  last_name: string;
  is_clinic_manager: boolean;
  is_doctor: boolean;
  is_patient: boolean;
  is_research_patient: boolean;
  groups: any[];
  user_permissions: any[];
  clinicId: number;
  clinicName: string;
  modules: any[];
  research_patient: boolean;
  status: string;
  server_url: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginResponse {
  user: User;
  token: string;
  refreshToken?: string;
}

async function loginUser(
  credentials: LoginCredentials
): Promise<LoginResponse> {
  try {
    const response = await axios.post<LoginResponse>(
      `${import.meta.env.VITE_API_URL}/login/`,
      credentials
    );

    const data = response.data;

    if (data.token) {
      localStorage.setItem("authToken", data.token);
    }

    if (data.refreshToken) {
      localStorage.setItem("refreshToken", data.refreshToken);
    }

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
        id: data.user.id,
        email: data.user.email,
        name: `${data.user.first_name} ${data.user.last_name}`,
        token: data.token,
      });
    },
    onError: (error) => {
      console.error("Login failed:", error);
    },
  });

  return mutation;
};
