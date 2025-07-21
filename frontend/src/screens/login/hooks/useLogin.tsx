import { useMutation } from "@tanstack/react-query";
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

interface LoginCredentials {
  email: string;
  password: string;
}

interface LoginResponse {
  user: User;
  token: string;
  refreshToken?: string;
}

const apiClient = axios.create({
  baseURL: "",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 5000,
});

async function fetchUser(
  credentials: LoginCredentials
): Promise<LoginResponse> {
  try {
    const response = await apiClient.post<LoginResponse>(
      "/api/v1/login/",
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
    console.error(error);
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
    mutationFn: (credentials: LoginCredentials) => fetchUser(credentials),
    onSuccess: (data) => {
      console.log("Login successful:", data);
      
      // Store user data in the store
      setUser(data.user);
            
      // Redirect to home
      window.location.href = "/home";
    },
    onError: (error) => {
      console.error("Login failed:", error.message);
      // TODO: Implement error handling
    },
  });

  return {
    login: mutation.mutate,
    data: mutation.data,
    isLoading: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
  };
};
