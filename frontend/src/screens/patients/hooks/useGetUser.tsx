import type { IUser } from "@/common/types/Users";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

/**
 * Fetch the selected user by clinic and patient ID.
 * @param clinicId - The ID of the clinic the user in.
 * @param patientId - The ID of the patient.
 * @returns The selected user data.
 */

async function fetchSelectedUser(
  clinicId: string,
  patientId: string
): Promise<IUser> {
  const url = `${
    import.meta.env.VITE_API_URL_DEV
  }users/${clinicId}/user/${patientId}/`;

  const { data } = await axios.get<IUser>(url, {
    headers: {
      "Content-Type": "application/json",
      "ngrok-skip-browser-warning": "true",
    },
    withCredentials: true,
  });

  return data;
}

export function useUser(
  clinicId: string,
  patientId: string,
  enabled: boolean = true
) {
  return useQuery<IUser, Error>({
    queryKey: ["user", clinicId, patientId],
    queryFn: () => fetchSelectedUser(clinicId, patientId),
    enabled,
    refetchOnWindowFocus: false,
    retry: false,
  });
}
